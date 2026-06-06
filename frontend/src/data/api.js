import { MOCK_PARKINGS } from "./mockData";

const PARKING_EMOJIS = ["🏢", "🏬", "🏛️", "🅿️", "✈️"];

const mapLotToCard = (lot, index) => ({
  id: lot.id ?? lot.parkingLotId,
  name: lot.name,
  address: lot.address,
  spots: lot.placesCount ?? 0,
  available: lot.reservablePlacesCount ?? 0,
  price: lot.pricePerHour != null ? Number(lot.pricePerHour) : 0,
  img: PARKING_EMOJIS[index % PARKING_EMOJIS.length],
  coords:
    lot.latitude != null && lot.longitude != null
      ? [Number(lot.latitude), Number(lot.longitude)]
      : [52.2297, 21.0122],
});

export async function fetchParkingLots() {
  try {
    const response = await fetch("/api/parking-lots");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return MOCK_PARKINGS;
    return data.map(mapLotToCard);
  } catch (error) {
    console.warn("Nie udało się pobrać parkingów z API — używam danych mockowych.", error);
    return MOCK_PARKINGS;
  }
}

async function apiCall(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  let data = null;
  try { data = await response.json(); } catch { /* brak ciała */ }
  if (!response.ok) {
    throw new Error(data?.message || `Błąd HTTP ${response.status}`);
  }
  return data;
}

export function registerCustomer(payload) {
  return apiCall("/api/auth/register", { method: "POST", body: JSON.stringify(payload) });
}

export function loginCustomer(payload) {
  return apiCall("/api/auth/login", { method: "POST", body: JSON.stringify(payload) });
}

export function fetchVehicles(customerId) {
  return apiCall(`/api/vehicles?customerId=${customerId}`);
}

export function addVehicle(payload) {
  return apiCall("/api/vehicles", { method: "POST", body: JSON.stringify(payload) });
}

export function deleteVehicle(vehicleId, customerId) {
  return apiCall(`/api/vehicles/${vehicleId}?customerId=${customerId}`, { method: "DELETE" });
}

export function setPrimaryVehicle(vehicleId, customerId) {
  return apiCall(`/api/vehicles/${vehicleId}/primary?customerId=${customerId}`, { method: "PATCH" });
}

export function fetchReservations(customerId) {
  return apiCall(`/api/reservations?customerId=${customerId}`);
}

export function createReservation(payload) {
  return apiCall("/api/reservations", { method: "POST", body: JSON.stringify(payload) });
}

export function cancelReservation(reservationId, customerId) {
  return apiCall(`/api/reservations/${reservationId}?customerId=${customerId}`, { method: "DELETE" });
}

export function checkAvailability(lotId, from, to) {
  return apiCall(`/api/parking-lots/${lotId}/availability?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
}

export function fetchParkingLotPrice(lotId, from, to) {
  return apiCall(`/api/parking-lots/${lotId}/price?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
}
