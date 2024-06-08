import mongoose from "mongoose";
import { User } from "../models/user.models.js";
import { Product } from "../models/product.models.js";
import {
  asyncHandler,
  ApiError,
  ApiResponse,
  ApiFeatures,
} from "../utils/index.js";

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

// request to become an admin or admin login
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
  req.body.owner = new mongoose.Types.ObjectId(req.user._id); // for objectId field of actual owner of that product
  const product = await Product.create(req.body);
  if (!product) {
    throw new ApiError(500, "something went wrong while creating product!!");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, product, "product created successfully"));
});

const getAllAdminProducts = asyncHandler(async (req, res) => {
  const resultsPerPage = 5;
  const totalProducts = await Product.countDocuments({ owner: req.user._id });
  const apiFeature = new ApiFeatures(
    Product.find({ owner: req.user._id }),
    req.query
  )
    .search()
    .filter()
    .pagination(resultsPerPage);
  const matchedProducts = await apiFeature?.query;
  const matchedProductsCount = matchedProducts.length;
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalProducts, matchedProductsCount, matchedProducts },
        "product founded sucessfully"
      )
    );
});

const getProductDetails = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const product = await Product.findById(_id);
  if (!product) {
    throw new ApiError(404, "product not found!!");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, product, "product deleted sucessfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const product = await Product.findById(_id);
  if (!product.owner === req.user._id) {
    throw new ApiError(405, "this product does not belongs to you !!");
  }

  const deletedProduct = await Product.findByIdAndDelete(_id);
  if (!deletedProduct) {
    throw new ApiError(404, "product not found!!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, deletedProduct, "product deleted sucessfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const product = await Product.findById(_id);
  if (!product?.owner === req.user?._id) {
    throw new ApiError(405, "this product does not belongs to you !!");
  } else if (!product) {
    throw new ApiError(404, "product not found!!");
  }

  const updatedProduct = await Product.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  if (!updateProduct) {
    throw new ApiError(404, "something went wrong while updating product!!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, updatedProduct, "product updated sucessfully"));
});

export {
  adminRequest,
  createProduct,
  getAllAdminProducts,
  getProductDetails,
  deleteProduct,
  updateProduct,
};
