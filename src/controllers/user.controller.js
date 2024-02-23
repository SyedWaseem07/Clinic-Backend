import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

// register user
// post :- /api/v1/users/register
const registerUser = asyncHandler( async (req, res) => {
    // get details from frontend
    // validate details (all feilds must be non-empty)
    // check for existing user
    // handle files
    // create user in db
    // check for creation of user
    // send resonse

    const { username, fullname, mobile_no, role, email, password } = req.body;

    if(!username || !fullname || !mobile_no || !role || !email || !password) 
        throw new ApiError(400, "All feilds are required except avatar")

    const existingUser = await User.findOne({
        $and: [{ fullname }, { role }]
    })

    if(existingUser) throw new ApiError(400, "User already exists")

    const avatarLocalPath = req.file?.path;

    let avatar;
    if(avatarLocalPath) avatar = await uploadOnCloudinary(avatarLocalPath);

    

    const user = await User.create({
        username, fullname, mobile_no, role, email, password, 
        avatar: avatar?.url || ""
    })

    const registeredUser = await User.findById(user._id).select("-password -refreshToken");

    if(!registeredUser) throw new ApiError(500, "Unable to register user");

    return res.status(201).json(new ApiResponse(200, registerUser, "User registered successfully"));
} )

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Unable to generate Access and refresh token")
    }
}
// login user  
// Post :- /api/v1/users/login
const loginUser = asyncHandler( async (req, res) => {
    // get details (role, username, password)
    // validate details
    // check if user present in db
    // check for password
    // generate tokens
    // send that tokens to client browser
    // send response

    const { role, username, password } = req.body;
    if(!role || !username || !password) throw new ApiError(400, "All feilds are required")

    const existingUser = await User.findOne({username})

    if(!existingUser) throw new ApiError(404, "User not found");

    const isPasswordCorrect = existingUser.isPasswordCorrect(password);

    if(!isPasswordCorrect) throw new ApiError(409, "Incorrect Password");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(existingUser._id);

    const loggedInUser = await User.findById(existingUser._id).select("-password")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User Logged in successfully"));
} )


// logout user
// Post :- /api/v1/users/logout
const logoutUser = asyncHandler( async (req, res) => {
    // find user
    // clear cookies
    // reset refresh token
    await User.findByIdAndUpdate(req.user._id, { $unset: {refreshToken: 1}}, {new:true})

    const options = {
        httpOnly: true,
        secure: true
    }


    return res.status(200).clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"))
} )

export {
    registerUser,
    loginUser,
    logoutUser
}