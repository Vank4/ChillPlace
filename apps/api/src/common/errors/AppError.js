export class AppError extends Error {
  constructor(statusCode, message, errors = undefined, code = undefined) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.errors = errors;
    this.code = code;
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(message = "Bad request", errors) {
    return new AppError(400, message, errors);
  }

  static unauthorized(message = "Unauthorized") {
    return new AppError(401, message);
  }

  static forbidden(message = "Forbidden") {
    return new AppError(403, message);
  }

  static notFound(message = "Not found") {
    return new AppError(404, message);
  }

  static conflict(message = "Conflict", errors) {
    return new AppError(409, message, errors);
  }

  static unprocessable(message = "Validation error", errors) {
    return new AppError(422, message, errors);
  }
}
