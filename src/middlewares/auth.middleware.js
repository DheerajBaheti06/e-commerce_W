import jwt from "jsonwebtoken";
import { User } from "./../models/user.models.js";
import { ApiError, asyncHandler } from "./../utils/index.js";

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

    req.user = user; // we can access cuurent user in controllers if this middleware applied, via "req.user.---"
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

//  middleware to stop user from doing admin & superadmin tasks
//  only admin & superadmin can pass this middleare
export const authorizeRoles = () => {
  try {
    return (req, _, next) => {
      if (req.user.role === "user") {
        return next(
          new ApiError(
            405,
            `Role: ${req.user.role} is not allowed to do such action.`
          )
        ); // throw keyword not written, since showing error
      }
      next();
    };
  } catch (error) {
    throw new ApiError(501, "something went wrong while authorizing roles");
  }
};
