import { env } from "../../config/env.js";

const bearerAuth = [{ bearerAuth: [] }];

function operation(summary, tags, { auth = false, body = false } = {}) {
  return {
    summary,
    tags: [tags],
    ...(auth ? { security: bearerAuth } : {}),
    ...(body
      ? {
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { type: "object", additionalProperties: true }
              }
            }
          }
        }
      : {}),
    responses: {
      200: {
        description: "Successful response",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/SuccessResponse" }
          }
        }
      },
      401: { $ref: "#/components/responses/Unauthorized" },
      422: { $ref: "#/components/responses/ValidationError" }
    }
  };
}

const routes = [
  ["get", "/health", "Service and database health", "Foundation"],
  ["post", "/auth/register", "Register account", "Auth", false, true],
  ["post", "/auth/login", "Login", "Auth", false, true],
  ["get", "/auth/me", "Current account", "Auth", true],
  ["patch", "/users/me", "Update current profile", "Users", true, true],
  ["get", "/users/{username}/public", "Public user profile", "Users"],
  ["get", "/users/{id}/posts", "Public user posts", "Users"],
  ["post", "/users/{id}/follow", "Toggle follow", "Users", true],
  ["get", "/categories", "Public categories", "Discovery"],
  ["get", "/places", "Search places", "Discovery"],
  ["get", "/places/nearby", "Nearby places", "Discovery"],
  ["get", "/places/{slug}", "Place detail", "Discovery"],
  ["get", "/places/{id}/reviews", "Place reviews", "Discovery"],
  ["get", "/places/{id}/promotions", "Place promotions", "Discovery"],
  ["get", "/places/{id}/related-posts", "Related place posts", "Discovery"],
  ["get", "/map/places", "Places in map bounds", "Discovery"],
  ["get", "/feed", "Public feed", "Discovery"],
  ["get", "/posts/{id}", "Post detail", "Discovery"],
  ["get", "/search", "Unified search", "Discovery"],
  ["get", "/recommendations", "Place and post recommendations", "Discovery"],
  ["get", "/tags/trending", "Trending tags", "Tags"],
  ["get", "/tags/search", "Search tags", "Tags"],
  ["get", "/tags/{slug}", "Tag detail", "Tags"],
  ["get", "/tags/{slug}/related", "Related tags", "Tags"],
  ["post", "/posts/{id}/like", "Toggle post like", "Interactions", true],
  ["post", "/posts/{id}/save", "Toggle saved post", "Interactions", true],
  ["get", "/posts/{id}/comments", "Post comments", "Interactions"],
  ["post", "/posts/{id}/comments", "Create comment", "Interactions", true, true],
  ["post", "/places/{id}/favorite", "Toggle place favorite", "Interactions", true],
  ["post", "/places/{id}/reviews", "Create place review", "Interactions", true, true],
  ["get", "/favorites", "Current user favorites", "Interactions", true],
  ["get", "/users/me/saved", "Current user saved posts", "Interactions", true],
  ["patch", "/reviews/{id}", "Update review", "Interactions", true, true],
  ["post", "/reviews/{id}/reply", "Reply to review", "Interactions", true, true],
  ["post", "/reports", "Create report", "Interactions", true, true],
  ["get", "/creator/stats", "Creator statistics", "Creator", true],
  ["get", "/creator/posts", "Creator posts", "Creator", true],
  ["get", "/creator/top-posts", "Creator top posts", "Creator", true],
  ["get", "/creator/analytics", "Creator analytics", "Creator", true],
  ["get", "/analytics/posts/{id}", "Post analytics", "Creator", true],
  ["get", "/business/{slug}/public", "Public business profile", "Business"],
  ["get", "/business/me", "Business profile", "Business", true],
  ["patch", "/business/me", "Update business profile", "Business", true, true],
  ["get", "/business/place", "Business place", "Business", true],
  ["patch", "/business/place", "Update business place", "Business", true, true],
  ["patch", "/business/menu", "Update business menu", "Business", true, true],
  ["get", "/business/media", "Business media", "Business", true],
  ["post", "/business/media", "Add business media", "Business", true],
  ["patch", "/business/media/order", "Reorder business media", "Business", true, true],
  ["delete", "/business/media/{id}", "Delete business media", "Business", true],
  ["get", "/business/reviews", "Business reviews", "Business", true],
  ["get", "/business/promotions", "Business promotions", "Business", true],
  ["get", "/business/stats", "Business statistics", "Business", true],
  ["post", "/business/promotions", "Create promotion", "Business", true, true],
  ["patch", "/business/promotions/{id}", "Update promotion", "Business", true, true],
  ["delete", "/business/promotions/{id}", "Delete promotion", "Business", true],
  ["post", "/role-requests/creator", "Request creator role", "Role Requests", true, true],
  ["post", "/role-requests/business", "Request business role", "Role Requests", true, true],
  ["get", "/role-requests/me", "Current user role requests", "Role Requests", true],
  ["get", "/admin/stats", "Admin statistics", "Admin", true],
  ["get", "/admin/audit-logs", "Audit logs", "Admin", true],
  ["get", "/admin/role-requests", "Role requests", "Admin", true],
  ["patch", "/admin/role-requests/{id}/approve", "Approve role request", "Admin", true, true],
  ["patch", "/admin/role-requests/{id}/reject", "Reject role request", "Admin", true, true],
  ["get", "/admin/users", "Manage users", "Admin", true],
  ["patch", "/admin/users/{id}/status", "Update user status", "Admin", true, true],
  ["get", "/admin/places", "Manage places", "Admin", true],
  ["patch", "/admin/places/{id}/status", "Update place status", "Admin", true, true],
  ["get", "/admin/reports", "Manage reports", "Admin", true],
  ["patch", "/admin/reports/{id}/resolve", "Resolve report", "Admin", true, true],
  ["patch", "/admin/posts/{id}/status", "Moderate post", "Admin", true, true],
  ["patch", "/admin/comments/{id}/status", "Moderate comment", "Admin", true, true],
  ["get", "/admin/tags", "Manage tags", "Admin", true],
  ["patch", "/admin/tags/{id}/status", "Update tag status", "Admin", true, true],
  ["post", "/admin/tags/merge", "Merge tags", "Admin", true, true],
  ["get", "/admin/categories", "Manage categories", "Admin", true],
  ["post", "/admin/categories", "Create category", "Admin", true, true],
  ["patch", "/admin/categories/{id}", "Update category", "Admin", true, true]
];

const paths = {};
for (const [method, path, summary, tag, auth = false, body = false] of routes) {
  paths[path] ??= {};
  paths[path][method] = operation(summary, tag, { auth, body });
}

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "ChillPlace API",
    version: "1.0.0",
    description:
      "REST API contract for public discovery, social interactions, creator, business and administration workflows."
  },
  servers: [
    { url: `${env.appUrl.replace(/\/$/, "")}/api`, description: env.nodeEnv }
  ],
  tags: [
    "Foundation",
    "Auth",
    "Users",
    "Discovery",
    "Tags",
    "Interactions",
    "Creator",
    "Business",
    "Role Requests",
    "Admin"
  ].map((name) => ({ name })),
  paths,
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" }
    },
    schemas: {
      SuccessResponse: {
        type: "object",
        required: ["success", "message", "data"],
        properties: {
          success: { type: "boolean", example: true },
          message: { type: "string", example: "OK" },
          data: { type: "object", additionalProperties: true },
          pagination: { type: "object", additionalProperties: true }
        }
      },
      ErrorResponse: {
        type: "object",
        required: ["success", "message"],
        properties: {
          success: { type: "boolean", example: false },
          message: { type: "string" },
          errors: { type: "object", additionalProperties: true }
        }
      }
    },
    responses: {
      Unauthorized: {
        description: "Authentication is required",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" }
          }
        }
      },
      ValidationError: {
        description: "Request validation failed",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" }
          }
        }
      }
    }
  }
};
