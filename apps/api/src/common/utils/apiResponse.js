export function success(
  res,
  { statusCode = 200, message = "OK", data = {}, pagination, cursor } = {}
) {
  const payload = { success: true, message, data };

  if (pagination) payload.pagination = pagination;
  if (cursor) payload.cursor = cursor;

  return res.status(statusCode).json(payload);
}

export function ok(res, data = {}, message = "OK", pagination) {
  return success(res, { data, message, pagination });
}

export function created(res, data = {}, message = "Created") {
  return success(res, { statusCode: 201, data, message });
}

export function noContent(res) {
  return res.status(204).send();
}

export function fail(res, status, message, errors) {
  const payload = { success: false, message };
  if (errors !== undefined) payload.errors = errors;
  return res.status(status).json(payload);
}

export function createPagination({ page, limit, total }) {
  return {
    page,
    limit,
    total,
    total_pages: total === 0 ? 0 : Math.ceil(total / limit)
  };
}

export function createCursor({ nextCursor = null, hasMore = false } = {}) {
  return {
    next_cursor: nextCursor,
    has_more: hasMore
  };
}
