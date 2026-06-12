import { Prisma } from "@prisma/client";
import multer from "multer";
import { ZodError } from "zod";
import { AppError } from "../common/errors/AppError.js";
import { loggerError } from "../common/logger/index.js";
import { fail } from "../common/utils/apiResponse.js";
import { env } from "../config/env.js";

function zodErrors(error) {
  return Object.fromEntries(
    error.issues.map((issue) => [
      issue.path.length > 0 ? issue.path.join(".") : "request",
      issue.message
    ])
  );
}

function normalizeError(error) {
  if (error instanceof AppError) return error;

  if (error instanceof ZodError) {
    return AppError.unprocessable("Validation error", zodErrors(error));
  }

  if (error instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: "Uploaded file is too large",
      LIMIT_FILE_COUNT: "Too many files uploaded",
      LIMIT_UNEXPECTED_FILE: "Unexpected upload field"
    };
    return AppError.badRequest(messages[error.code] || "Invalid upload");
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return AppError.conflict("Resource already exists", {
        fields: error.meta?.target
      });
    }
    if (error.code === "P2025") {
      return AppError.notFound("Resource not found");
    }
  }

  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return AppError.badRequest("Invalid JSON body");
  }

  return new AppError(500, "Internal server error");
}

export function errorMiddleware(error, req, res, next) {
  const appError = normalizeError(error);

  if (appError.statusCode >= 500) {
    loggerError("Unhandled request error", {
      method: req.method,
      path: req.originalUrl,
      message: error?.message
    });

    if (env.nodeEnv !== "production" && error?.stack) {
      console.error(error.stack);
    }
  }

  return fail(res, appError.statusCode, appError.message, appError.errors);
}
