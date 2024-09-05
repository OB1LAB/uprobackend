class ApiError extends Error {
  constructor(status, message) {
    super();
    this.message = message;
    this.status = status;
  }

  static forbidden(message) {
    return new ApiError(403, message);
  }
  static badRequest(message) {
    return new ApiError(400, message);
  }

  static internal(message) {
    return new ApiError(500, message);
  }

  static UnauthorizedError() {
    return new ApiError(401, "Не авторизован");
  }
}

export default ApiError;
