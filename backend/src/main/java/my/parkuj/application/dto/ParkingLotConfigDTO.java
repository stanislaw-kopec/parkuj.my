package my.parkuj.application.dto;

// Body PATCH /api/parking-lots/{id}/config — operator zmienia podział miejsc (US-A05)
// i godziny otwarcia. Pola null = bez zmiany; openFrom/openTo "" = czyszczenie (całą dobę).
public class ParkingLotConfigDTO {
    private Integer placesCount;
    private Integer reservablePlacesCount;
    private String openFrom;
    private String openTo;

    public Integer getPlacesCount() { return placesCount; }
    public void setPlacesCount(Integer placesCount) { this.placesCount = placesCount; }

    public Integer getReservablePlacesCount() { return reservablePlacesCount; }
    public void setReservablePlacesCount(Integer reservablePlacesCount) { this.reservablePlacesCount = reservablePlacesCount; }

    public String getOpenFrom() { return openFrom; }
    public void setOpenFrom(String openFrom) { this.openFrom = openFrom; }

    public String getOpenTo() { return openTo; }
    public void setOpenTo(String openTo) { this.openTo = openTo; }
}
