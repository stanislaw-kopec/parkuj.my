package my.parkuj.application.dto;

// Body PATCH /api/parking-lots/{id}/config — operator zmienia podział miejsc (US-A05).
public class ParkingLotConfigDTO {
    private Integer placesCount;
    private Integer reservablePlacesCount;

    public Integer getPlacesCount() { return placesCount; }
    public void setPlacesCount(Integer placesCount) { this.placesCount = placesCount; }

    public Integer getReservablePlacesCount() { return reservablePlacesCount; }
    public void setReservablePlacesCount(Integer reservablePlacesCount) { this.reservablePlacesCount = reservablePlacesCount; }
}
