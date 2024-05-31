import {
  ApiError,
  ApiResponse,
  asyncHandler,
  // uploadOnCloudinary,
} from "../utils/index.js";
import { User } from "../models/user.models.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while gnerating refresh and access tokens"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const isExistedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (isExistedUser) {
    throw new ApiError(409, "user with email or username already exists");
  }

  // const avatarLocalPath = req.file?.path; // ----------------req.file does not contain path---error point
  // if (!avatarLocalPath) {
  //   throw new ApiError(400, "Avatar is required field");
  // }

  // const avatar = await uploadOnCloudinary(avatarLocalPath);
  // if (!avatar) {
  //   throw new ApiError(400, "something went wrong while uploading !!");
  // }

  const user = await User.create({
    username: username.toLowerCase(),
    password,
    email,
    // avatar: avatar.url,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -resetPasswordToken -resetPasswordExpire"
  );
  if (!createdUser) {
    throw new ApiError(
      400,
      "something went wrong while registering the user !!"
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username && !email) {
    throw new ApiError(400, "USERNAME AND EMAIL is rquired");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new ApiError(400, "user does not exists !!");
  }

  const isPaswordValid = await user.isPasswordCorrect(password);
  if (!isPaswordValid) {
    throw new ApiError(404, "PASSWORD is wrong !!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          loggedInUser,
          accessToken,
          refreshToken,
        },
        "user logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  User.findByIdAndUpdate(
    req.user._id, // since user is ALREADY LOGIN.
    {
      $unset: { refreshToken: 1 }, // this removes the field from document
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"));
});

export { registerUser, loginUser, logoutUser };
