import jwt from "jsonwebtoken";
import { User } from "./../models/user.models.js";
import { ApiError, asyncHandler } from "./../utils/index.js";
import { error } from "console";
import { throws } from "assert";

// verifyJWT means verified(i.e. login) hai ya nhi :-
export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      (await req.cookies?.accessToken) ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user; // we can access abything about user in controllers via "req.user.---"
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

export const authorizeRoles = (...roles) => {
  return (req, _, next) => {
    if (!roles.includes(req.user.role)) {
      return next( new ApiError(403, `Role: ${req.user.role} is not allowed to access this resource`) ) // throw nahi likha hu, since showing error
    }
    next();
  }
}
