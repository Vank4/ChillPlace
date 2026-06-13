export function toNumber(value) {
  if (value === null || value === undefined) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export function distanceKm(lat1, lng1, lat2, lng2) {
  const values = [lat1, lng1, lat2, lng2].map(toNumber);
  if (values.some((value) => value === null)) return null;

  const [fromLat, fromLng, toLat, toLng] = values;
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const latDelta = radians(toLat - fromLat);
  const lngDelta = radians(toLng - fromLng);
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(radians(fromLat)) *
      Math.cos(radians(toLat)) *
      Math.sin(lngDelta / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function isOpenNow(openingHours, now = new Date()) {
  if (!openingHours || typeof openingHours !== "object") return null;

  const dayKeys = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday"
  ];
  const schedule =
    openingHours[dayKeys[now.getDay()]] ??
    openingHours[String(now.getDay())] ??
    openingHours.daily;

  if (schedule === "closed" || schedule?.closed === true) return false;
  if (schedule === "24h" || schedule?.open24Hours === true) return true;

  const open = typeof schedule === "string" ? schedule.split("-")[0] : schedule?.open;
  const close = typeof schedule === "string" ? schedule.split("-")[1] : schedule?.close;
  if (!open || !close) return null;

  const toMinutes = (time) => {
    const [hour, minute] = String(time).trim().split(":").map(Number);
    return Number.isInteger(hour) && Number.isInteger(minute)
      ? hour * 60 + minute
      : null;
  };
  const openMinutes = toMinutes(open);
  const closeMinutes = toMinutes(close);
  if (openMinutes === null || closeMinutes === null) return null;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  if (closeMinutes < openMinutes) {
    return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
  }
  return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
}

export function encodeCursor(id) {
  return Buffer.from(String(id), "utf8").toString("base64url");
}

export function decodeCursor(cursor) {
  if (!cursor) return null;
  const id = Number(Buffer.from(cursor, "base64url").toString("utf8"));
  return Number.isInteger(id) && id > 0 ? id : null;
}
