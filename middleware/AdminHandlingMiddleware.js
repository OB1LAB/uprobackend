import ApiError from "../error/ApiError";
import { passwords } from "../consts";

const AdminHandlingMiddleware = (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password !== Object.keys(passwords).includes(password)) {
      return next(ApiError.forbidden("Недостаточно прав"));
    }
    req.group = passwords[password];
    next();
  } catch (error) {
    console.log(error);
    return next(ApiError.UnauthorizedError());
  }
};

export default AdminHandlingMiddleware;
