import { created, noContent, ok } from "../../common/utils/apiResponse.js";
import { cleanupUploadedFiles } from "../../middlewares/upload.middleware.js";
import {
  addBusinessMedia,
  addBusinessPromotion,
  editBusiness,
  editBusinessMenu,
  editBusinessPlace,
  editBusinessPromotion,
  getBusinessMe,
  getBusinessMedia,
  getBusinessPlace,
  getBusinessPromotions,
  getBusinessReviews,
  getBusinessStats,
  getPublicBusiness,
  removeBusinessMedia,
  removeBusinessPromotion,
  reorderMedia
} from "./business.service.js";

export async function me(req, res) {
  return ok(res, {
    business: await getBusinessMe(req.user, req.validated.query)
  });
}

export async function updateMe(req, res) {
  return ok(
    res,
    {
      business: await editBusiness(
        req.user,
        req.validated.query,
        req.validated.body
      )
    },
    "Business profile updated"
  );
}

export async function publicProfile(req, res) {
  return ok(res, {
    business: await getPublicBusiness(req.validated.params.slug)
  });
}

export async function place(req, res) {
  return ok(res, {
    place: await getBusinessPlace(req.user, req.validated.query)
  });
}

export async function updatePlace(req, res) {
  return ok(
    res,
    {
      place: await editBusinessPlace(
        req.user,
        req.validated.query,
        req.validated.body
      )
    },
    "Business place updated"
  );
}

export async function updateMenu(req, res) {
  return ok(
    res,
    {
      menu: await editBusinessMenu(
        req.user,
        req.validated.query,
        req.validated.body
      )
    },
    "Business menu updated"
  );
}

export async function media(req, res) {
  return ok(res, await getBusinessMedia(req.user, req.validated.query));
}

export async function addMedia(req, res) {
  try {
    return created(
      res,
      {
        items: await addBusinessMedia(
          req.user,
          req.validated.query,
          req.validated.body,
          req.files
        )
      },
      "Business media added"
    );
  } catch (error) {
    await cleanupUploadedFiles(req.files);
    throw error;
  }
}

export async function reorder(req, res) {
  return ok(
    res,
    {
      items: await reorderMedia(
        req.user,
        req.validated.query,
        req.validated.body
      )
    },
    "Business media reordered"
  );
}

export async function removeMedia(req, res) {
  await removeBusinessMedia(
    req.user,
    req.validated.query,
    req.validated.params.id
  );
  return noContent(res);
}

export async function stats(req, res) {
  return ok(res, {
    stats: await getBusinessStats(req.user, req.validated.query)
  });
}

export async function reviews(req, res) {
  const result = await getBusinessReviews(req.user, req.validated.query);
  return ok(res, { items: result.items }, "OK", result.pagination);
}

export async function promotions(req, res) {
  const result = await getBusinessPromotions(req.user, req.validated.query);
  return ok(res, { items: result.items }, "OK", result.pagination);
}

export async function createPromotion(req, res) {
  return created(
    res,
    {
      promotion: await addBusinessPromotion(
        req.user,
        req.validated.query,
        req.validated.body
      )
    },
    "Promotion created"
  );
}

export async function updatePromotion(req, res) {
  return ok(
    res,
    {
      promotion: await editBusinessPromotion(
        req.user,
        req.validated.query,
        req.validated.params.id,
        req.validated.body
      )
    },
    "Promotion updated"
  );
}

export async function deletePromotion(req, res) {
  await removeBusinessPromotion(
    req.user,
    req.validated.query,
    req.validated.params.id
  );
  return noContent(res);
}
