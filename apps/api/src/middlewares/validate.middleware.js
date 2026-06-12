import { AppError } from "../common/errors/AppError.js";

function formatIssues(issues) {
  return Object.fromEntries(
    issues.map((issue) => [
      issue.path.length > 0 ? issue.path.join(".") : "request",
      issue.message
    ])
  );
}

export function validateRequest(schemas = {}) {
  return async (req, res, next) => {
    try {
      const validated = {};

      for (const key of ["params", "query", "body"]) {
        const schema = schemas[key];
        if (!schema) continue;

        const result = await schema.safeParseAsync(req[key]);
        if (!result.success) {
          return next(
            AppError.unprocessable(
              "Validation error",
              formatIssues(result.error.issues)
            )
          );
        }

        validated[key] = result.data;
      }

      req.validated = validated;
      if (validated.params) req.params = validated.params;
      if (validated.body) req.body = validated.body;
      if (validated.query) {
        for (const key of Object.keys(req.query)) delete req.query[key];
        Object.assign(req.query, validated.query);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
