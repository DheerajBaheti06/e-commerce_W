import { User } from "../models/user.models.js";
import { Product } from "../models/product.models.js";
import { asyncHandler, ApiError, ApiResponse } from "../utils/index.js";

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

const adminRequest = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if ([username, email, password].some((field) => field?.trim === "")) {
    throw new ApiError(404, "All fields re required !!");
  }
  const isExistedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!isExistedUser) {
    throw new ApiError(404, "user does not exists!!");
  }
  const isPasswordValid = await isExistedUser.isPasswordCorrect(
    String(password)
  );
  if (!isPasswordValid) {
    throw new ApiError(404, "password is wrong !!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    isExistedUser._id
  );

  const updatedUser = await User.findByIdAndUpdate(
    await isExistedUser?._id,
    {
      role: "admin",
    },
    { new: true }
  );
  await updatedUser.save({ validateBeforeSave: false });
  if (!updatedUser) {
    throw new ApiError(401, "something went wrong!");
  }

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
        201,
        {
          updatedUser,
          accessToken,
          refreshToken,
        },
        `${updatedUser.username} is now admin.`
      )
    );
});

const createProduct = asyncHandler(async (req, res) => {
  //   req.body.owner = req.user._id; // for adding owner field
  const product = await Product.create(req.body);
  if (!product) {
    throw new ApiError(500, "something went wrong while creating product!!");
  }
  const updatedProduct = product.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "$owner",
      },
    },
  ]);
  if (!updatedProduct) {
    throw new ApiError(
      500,
      "something went wrong while updating owner field !!"
    );
  }
  return res
    .status(201)
    .json(new ApiResponse(200, updatedProduct, "product created successfully"));
});

export { adminRequest, createProduct };
