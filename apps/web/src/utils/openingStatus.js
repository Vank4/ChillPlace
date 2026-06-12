function parseTimeToMinutes(time) {
  if (!time) {
    return null;
  }

  const [hours, minutes] = time.split(":").map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
}

function getMinutesUntil(targetMinutes, currentMinutes) {
  return (targetMinutes - currentMinutes + 1440) % 1440;
}

function isBetweenOperatingHours(currentMinutes, openMinutes, closeMinutes) {
  if (openMinutes === closeMinutes) {
    return true;
  }

  if (openMinutes < closeMinutes) {
    return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
  }

  return currentMinutes >= openMinutes || currentMinutes < closeMinutes;
}

export function getOpeningStatus(openingHours, currentDate = new Date()) {
  const openMinutes = parseTimeToMinutes(openingHours?.open);
  const closeMinutes = parseTimeToMinutes(openingHours?.close);

  if (openMinutes === null || closeMinutes === null) {
    return { label: "Đang đóng", tone: "closed", isOpen: false };
  }

  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
  const isOpen = isBetweenOperatingHours(currentMinutes, openMinutes, closeMinutes);
  const minutesUntilOpen = getMinutesUntil(openMinutes, currentMinutes);
  const minutesUntilClose = getMinutesUntil(closeMinutes, currentMinutes);

  if (isOpen && minutesUntilClose <= 30) {
    return { label: "Sắp đóng", tone: "closing", isOpen: true };
  }

  if (isOpen) {
    return { label: "Đang mở", tone: "open", isOpen: true };
  }

  if (minutesUntilOpen <= 30) {
    return { label: "Sắp mở", tone: "opening", isOpen: false };
  }

  return { label: "Đang đóng", tone: "closed", isOpen: false };
}
