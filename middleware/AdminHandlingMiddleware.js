import ApiError from "../error/ApiError.js";

const AdminHandlingMiddleware = (req, res, next) => {
  try {
    const { password } = req.headers;
    if (password !== process.env.BOT_PASSOWRD) {
      return next(ApiError.forbidden("Недостаточно прав"));
    }
    next();
  } catch (error) {
    console.log(error);
    return next(ApiError.UnauthorizedError());
  }
};

export default AdminHandlingMiddleware;
