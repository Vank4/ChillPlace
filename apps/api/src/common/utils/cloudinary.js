import { createHash } from "node:crypto";
import { env } from "../../config/env.js";

function signature(parameters) {
  const payload = Object.entries(parameters)
    .filter(([, value]) => value !== undefined && value !== "")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return createHash("sha1")
    .update(`${payload}${env.cloudinaryApiSecret}`)
    .digest("hex");
}

async function cloudinaryRequest(resourceType, action, parameters, file) {
  const form = new FormData();
  for (const [key, value] of Object.entries(parameters)) {
    form.append(key, String(value));
  }
  form.append("api_key", env.cloudinaryApiKey);
  form.append("signature", signature(parameters));
  if (file) {
    form.append("file", new Blob([file.buffer], { type: file.mimetype }));
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/${resourceType}/${action}`,
    { method: "POST", body: form }
  );
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error?.message || "Cloudinary request failed");
  }
  return result;
}

export async function uploadCloudinaryFile(file) {
  const timestamp = Math.floor(Date.now() / 1000);
  const result = await cloudinaryRequest(
    file.mimetype.startsWith("video/") ? "video" : "image",
    "upload",
    { folder: env.cloudinaryFolder, timestamp },
    file
  );
  return {
    url: result.secure_url,
    publicId: result.public_id,
    resourceType: result.resource_type
  };
}

export async function deleteCloudinaryAsset(publicId, resourceType = "image") {
  if (!publicId) return;
  const timestamp = Math.floor(Date.now() / 1000);
  await cloudinaryRequest(resourceType, "destroy", {
    public_id: publicId,
    timestamp
  });
}

export function cloudinaryAssetFromUrl(url) {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("res.cloudinary.com")) return null;
    const marker = parsed.pathname.indexOf("/upload/");
    if (marker < 0) return null;
    const resourceType = parsed.pathname.includes("/video/upload/")
      ? "video"
      : "image";
    const path = parsed.pathname.slice(marker + "/upload/".length);
    const withoutVersion = path.replace(/^v\d+\//, "");
    return {
      publicId: withoutVersion.replace(/\.[a-z0-9]+$/i, ""),
      resourceType
    };
  } catch {
    return null;
  }
}
