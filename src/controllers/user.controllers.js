import { ApiError, ApiResponse, asyncHandler, uploadOnCloudinary } from "../utils/index.js";
import { User } from "../models/user.models.js";

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
    "-resetPasswordToken -resetPasswordExpire"
  );
  if (!createdUser) {
    throw new ApiError(400, "something went wrong while registering the user !!");
  }

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered Successfully")
  )

});



export { registerUser };
