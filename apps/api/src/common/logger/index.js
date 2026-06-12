function write(method, level, message, meta = {}) {
  const details = Object.keys(meta).length > 0 ? ` ${JSON.stringify(meta)}` : "";
  console[method](
    `${new Date().toISOString()} ${level.toUpperCase()} ${message}${details}`
  );
}

export function loggerInfo(message, meta = {}) {
  write("log", "info", message, meta);
}

export function loggerError(message, meta = {}) {
  write("error", "error", message, meta);
}
