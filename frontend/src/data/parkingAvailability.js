export const calcHours = (from, to) => {
  const [fH, fM] = from.split(":").map(Number);
  const [tH, tM] = to.split(":").map(Number);
  const diff = tH * 60 + tM - (fH * 60 + fM);
  return Math.max(0, Math.round((diff / 60) * 10) / 10);
};

export const getParkingAvailability = (parking, date, timeFrom, timeTo) => {
  if (!parking) return 0;

  const dateSeed = Number(String(date || "").replaceAll("-", "").slice(-4)) || 0;
  const [fromHour = 0] = String(timeFrom || "00:00").split(":").map(Number);
  const hours = calcHours(timeFrom || "00:00", timeTo || "00:00");
  const peakPenalty = fromHour >= 8 && fromHour <= 10 ? 12 : fromHour >= 16 && fromHour <= 18 ? 18 : 0;
  const durationPenalty = Math.max(0, Math.round((hours - 2) * 3));
  const datePenalty = (dateSeed + parking.id * 7) % 19;

  return Math.max(0, Math.min(parking.spots, parking.available - peakPenalty - durationPenalty - datePenalty));
};

export const getParkingStats = (parking, date, timeFrom, timeTo) => {
  const available = getParkingAvailability(parking, date, timeFrom, timeTo);
  const occupied = Math.max(0, parking.spots - available);
  const occupancy = Math.round((occupied / parking.spots) * 100);
  const reservable = Math.round(parking.spots * 0.68);
  const walkIn = parking.spots - reservable;

  return {
    available,
    occupied,
    occupancy,
    reservable,
    walkIn,
    reservationsToday: Math.max(8, Math.round((parking.spots * occupancy) / 180)),
    revenueToday: Math.round(parking.price * occupied * 1.7),
    avgStay: occupancy > 80 ? "3h 10min" : occupancy > 60 ? "2h 35min" : "1h 50min",
    peak: parking.id === 4 ? "05:00-08:00" : occupancy > 80 ? "16:00-18:00" : "09:00-11:00",
  };
};
