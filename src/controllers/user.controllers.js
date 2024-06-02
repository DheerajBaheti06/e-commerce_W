import {
  ApiError,
  ApiResponse,
  asyncHandler,
  sendEmail,
  // uploadOnCloudinary,
} from "../utils/index.js";
import { User } from "../models/user.models.js";
import { log } from "console";

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

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "user not found !!");
  }

  const resetToken = user.getResetPasswordToken();
  if (!resetToken) {
    throw new ApiError(
      404,
      "something went wrong while generating Reset Password Token !!"
    );
  }

  await user.save({ validateBeforeSave: false });
  console.log("reset passwod token is:- ", await user.getResetPasswordToken());

  // https://miniature-engine-5gqp69vxqqv9hj59-8000.app.github.dev/api/v1
  // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`;
  const resetPasswordUrl = `${req.protocol}://miniature-engine-5gqp69vxqqv9hj59-8000.app.github.dev/api/v1/password/reset/${resetToken}`;

  const message = `your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore !!`;

  try {
    console.log("sending email");
    await sendEmail({
      email: user.email,
      subject: "commerce Password Recovery",
      message: "",
    });

    return res
      .status(200)
      .json(
        new ApiResponse(201, `Email is sent to ${user.email} successfully`)
      );
  } catch (error) {
    console.log("error in tryCatch:", error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    throw new ApiError(500, error.message);
  }
});

export { registerUser, loginUser, logoutUser, forgotPassword };
