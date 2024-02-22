import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import { uploadCloudinary } from "../utils/cloudinary.js"

const registerUser = asyncHandler( async (req, res, next) => {
    // get user details from frontend (user model feilds)
    // validate details (all feilds must be present)
    // check if user already exist
    // check for avatar, files
    //  upload to cloudinary
    // create user in db
    // check for user creation and send response

    const { username, fullname, mobile_no, role, email, password } = req.body;
    if(!username || !fullname || !mobile_no || !role || !email || !password) 
        throw new ApiError(400, "All feilds execpt avatar are required")
    
    const existingUser = await User.findOne({
        $and: [{ username }, { role }]
    })

    if(existingUser) throw new ApiError(409, "User with name and role already exists");

    let avatar;
    if(req.files && Array.isArray(req.files.avatar) && req.files.avatar.length > 0) {
        let avatarLocalPath = req.files.avatar[0].path;
        avatar = await uploadCloudinary(avatarLocalPath);
    }

    if(!avatar) throw new ApiError(500, "Unable to upload avatar");

    const user = await User.create({
        username, 
        fullname, 
        mobile_no, 
        role, 
        email, 
        password,
        avatar
    })

    const registeredUser = await User.findOne(user?._id).select("-password -refreshToken");

    if(!registerUser) throw new ApiError(500, "Unable to register user");

    return res.status(201).json(new ApiResponse(200, registerUser, "User registered successfully"));

} )

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        
        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something Went Wrong while generating access and refresh tokens")
    }
}

const loginUser = asyncHandler( async (req, res, next) => {
    // get details from frontend (role, username, password)
    // Validate details (all feilds must be non-empty)
    // find user in db
    // compare password
    // generate tokens
    // send token to clients browser
    // send response

    const { role, username, password } = req.body;

    if(!role || !username || !password) throw new ApiError(400, "All feilds are required");

    const existingUser = await User.findOne(username);

    if(!existingUser) throw new ApiError(404, "User does not exists")

    const isPasswordCorrect = await existingUser.isPasswordCorrect(password);

    if(!isPasswordCorrect) throw new ApiError(401, "Invalid user credentails")

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(existingUser._id);

    const loggedInUser = await User.findById(existingUser._id).select(
        "-password"
    )

    const options = {
        httpOnly: true,     // only server can modify
        secure: true
    }

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, {
            user: loggedInUser,
            accessToken,
            refreshToken
        }, "User Logged In Successfully"));
} )

const logoutUser = asyncHandler( async (req, res, next) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $unset: { refreshToken: 1 },
        },
        { new: true }
    );

    const options = {
        httpOnly: true,
        secure: true,
    };
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
})

export { registerUser, loginUser, logoutUser }