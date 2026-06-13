import { ok } from "../../common/utils/apiResponse.js";
import {
  getCategories,
  getMapPlaces,
  getNearbyPlaces,
  getPlaceDetail,
  getPlacePromotions,
  getPlaceReviews,
  getPlaces,
  getRelatedPosts
} from "./places.service.js";

export async function categories(req, res) {
  return ok(res, { items: await getCategories() });
}

export async function places(req, res) {
  const result = await getPlaces(req.validated.query);
  return ok(res, { items: result.items }, "OK", result.pagination);
}

export async function nearby(req, res) {
  const result = await getNearbyPlaces(req.validated.query);
  return ok(res, { items: result.items }, "OK", result.pagination);
}

export async function mapPlaces(req, res) {
  return ok(res, { items: await getMapPlaces(req.validated.query) });
}

export async function placeDetail(req, res) {
  return ok(res, { place: await getPlaceDetail(req.validated.params.slug) });
}

export async function reviews(req, res) {
  const result = await getPlaceReviews(
    req.validated.params.id,
    req.validated.query
  );
  return ok(res, { items: result.items }, "OK", result.pagination);
}

export async function promotions(req, res) {
  const result = await getPlacePromotions(
    req.validated.params.id,
    req.validated.query
  );
  return ok(res, { items: result.items }, "OK", result.pagination);
}

export async function relatedPosts(req, res) {
  const result = await getRelatedPosts(
    req.validated.params.id,
    req.validated.query
  );
  return ok(res, { items: result.items }, "OK", result.pagination);
}
