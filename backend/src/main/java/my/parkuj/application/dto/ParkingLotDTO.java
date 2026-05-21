package my.parkuj.application.dto;

import my.parkuj.application.model.ParkingLot;
import java.math.BigDecimal;

public class ParkingLotDTO {
    private Integer parkingLotId;
    private String name;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer placesCount;
    private Integer reservablePlacesCount;
    private BigDecimal pricePerHour;

    public Integer getParkingLotId() { return parkingLotId; }
    public void setParkingLotId(Integer parkingLotId) { this.parkingLotId = parkingLotId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public BigDecimal getLatitude() { return latitude; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }

    public BigDecimal getLongitude() { return longitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }

    public Integer getPlacesCount() { return placesCount; }
    public void setPlacesCount(Integer placesCount) { this.placesCount = placesCount; }

    public Integer getReservablePlacesCount() { return reservablePlacesCount; }
    public void setReservablePlacesCount(Integer reservablePlacesCount) { this.reservablePlacesCount = reservablePlacesCount; }

    public BigDecimal getPricePerHour() { return pricePerHour; }
    public void setPricePerHour(BigDecimal pricePerHour) { this.pricePerHour = pricePerHour; }

    public static ParkingLotDTO fromEntity(ParkingLot lot) {
        if (lot == null) return null;
        ParkingLotDTO dto = new ParkingLotDTO();
        dto.parkingLotId = lot.getParkingLotId();
        dto.name = lot.getName();
        dto.address = lot.getAddress();
        dto.latitude = lot.getLatitude();
        dto.longitude = lot.getLongitude();
        dto.placesCount = lot.getPlacesCount();
        dto.reservablePlacesCount = lot.getReservablePlacesCount();
        return dto;
    }
}

