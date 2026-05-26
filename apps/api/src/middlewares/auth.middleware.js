export function requireAuth(req, res, next) {
  // TODO: verify JWT and attach req.user
  return res.status(501).json({ success: false, message: "Auth middleware not implemented yet" });
}
