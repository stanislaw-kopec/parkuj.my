import { MOCK_PARKINGS } from "./mockData";

const PARKING_EMOJIS = ["🏢", "🏬", "🏛️", "🅿️", "✈️"];

// Mapuje ParkingLotDTO z backendu na kształt karty używany przez PCard.
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

// Pobiera listę parkingów z backendu (GET /api/parking-lots).
// W razie błędu lub braku danych zwraca dane mockowe — UI działa nawet
// bez uruchomionego API, więc mockup pozostaje prezentowalny offline.
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
