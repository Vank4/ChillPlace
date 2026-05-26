export function ok(res, data = {}, message = "OK", pagination) {
  const payload = { success: true, message, data };
  if (pagination) payload.pagination = pagination;
  return res.status(200).json(payload);
}

export function created(res, data = {}, message = "Created") {
  return res.status(201).json({ success: true, message, data });
}

export function fail(res, status, message, errors) {
  return res.status(status).json({ success: false, message, errors });
}
