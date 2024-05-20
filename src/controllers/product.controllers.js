import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.models.js";

const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  if (!product) {
    throw new ApiError(500, "something went wrong while creating product!!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, product, "product created successfully"));
});

const getAllProducts = asyncHandler(async (req, res) => {
    const allProducts = await Product.find();
    if (!allProducts) {
      throw new ApiError(404, "product not found!!");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, allProducts, "Route is working fine"));
  
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  if (!_id) {
    throw new ApiError(404, "Atlest one product should be selected!!");
  }
  const deletedProduct = await Product.findByIdAndDelete(_id);
  if (!deletedProduct) {
    throw new ApiError(404, "product not found!!");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, deletedProduct, "product deleted sucessfully"));
});

const updateProduct = asyncHandler( async (req, res) => {
  const {_id} = req.params;
  let product = await Product.findById(_id)
  if (!product) {
    throw new ApiError(404, "product not found!!")
  }
  const updatedProduct = await Product.findByIdAndUpdate(_id, req.body, {new:true})
  return res
    .status(201)
    .json(new ApiResponse(200, updatedProduct, "product updated sucessfully"));
  
})

export { createProduct, getAllProducts, deleteProduct, updateProduct };
