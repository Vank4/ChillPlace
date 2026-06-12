import { randomUUID } from "node:crypto";
import { mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import { AppError } from "../common/errors/AppError.js";
import { env } from "../config/env.js";

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp"
]);
const VIDEO_MIME_TYPES = new Set(["video/mp4"]);
const ALLOWED_MIME_TYPES = new Set([
  ...IMAGE_MIME_TYPES,
  ...VIDEO_MIME_TYPES
]);

const apiRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);
const uploadRoot = path.isAbsolute(env.uploadDir)
  ? env.uploadDir
  : path.resolve(apiRoot, env.uploadDir);

function extensionFor(file) {
  const extensions = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "video/mp4": ".mp4"
  };
  return extensions[file.mimetype] || "";
}

export function createStoredFilename(file) {
  return `${randomUUID()}${extensionFor(file)}`;
}

const diskStorage = multer.diskStorage({
  destination(req, file, callback) {
    mkdir(uploadRoot, { recursive: true })
      .then(() => callback(null, uploadRoot))
      .catch(callback);
  },
  filename(req, file, callback) {
    callback(null, createStoredFilename(file));
  }
});

function createMulter(storage) {
  return multer({
    storage,
    limits: {
      files: 10,
      fileSize: env.maxVideoSizeMb * 1024 * 1024
    },
    fileFilter(req, file, callback) {
      if (!ALLOWED_MIME_TYPES.has(file.mimetype)) {
        return callback(
          AppError.badRequest(
            "Unsupported file type. Allowed: jpg, jpeg, png, webp, mp4."
          )
        );
      }
      callback(null, true);
    }
  });
}

async function cleanup(files = []) {
  await Promise.all(
    files.map((file) => unlink(file.path).catch(() => undefined))
  );
}

export function uploadFiles(
  fieldName = "files",
  maxCount = 10,
  { storage = "disk" } = {}
) {
  const storageEngine =
    storage === "memory" ? multer.memoryStorage() : diskStorage;
  const middleware = createMulter(storageEngine).array(fieldName, maxCount);

  return (req, res, next) => {
    middleware(req, res, async (error) => {
      if (error) {
        await cleanup(req.files);
        return next(error);
      }

      const oversizedImage = req.files?.find(
        (file) =>
          IMAGE_MIME_TYPES.has(file.mimetype) &&
          file.size > env.maxImageSizeMb * 1024 * 1024
      );

      if (oversizedImage) {
        await cleanup(req.files);
        return next(
          AppError.badRequest(
            `Image files must not exceed ${env.maxImageSizeMb} MB.`
          )
        );
      }

      next();
    });
  };
}

export const uploadMedia = uploadFiles("files", 10);

export const uploadConfig = Object.freeze({
  root: uploadRoot,
  imageMimeTypes: [...IMAGE_MIME_TYPES],
  videoMimeTypes: [...VIDEO_MIME_TYPES],
  maxImageSizeMb: env.maxImageSizeMb,
  maxVideoSizeMb: env.maxVideoSizeMb
});
