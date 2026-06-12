package my.parkuj.application.dto;

import java.math.BigDecimal;
import java.time.LocalTime;
import my.parkuj.application.model.ParkingLot;

public class ParkingLotDTO {
    private Integer id;
    private Integer parkingLotId;
    private String name;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer placesCount;
    private Integer reservablePlacesCount;
    private Integer walkInPlacesCount;
    private String status;
    private BigDecimal pricePerHour;
    private String currency;
    private String openFrom;
    private String openTo;

    public Integer getId() { return id; }
    public void setId(Integer id) {
        this.id = id;
        this.parkingLotId = id;
    }

    public Integer getParkingLotId() { return parkingLotId; }
    public void setParkingLotId(Integer parkingLotId) {
        this.parkingLotId = parkingLotId;
        this.id = parkingLotId;
    }

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

    public Integer getWalkInPlacesCount() { return walkInPlacesCount; }
    public void setWalkInPlacesCount(Integer walkInPlacesCount) { this.walkInPlacesCount = walkInPlacesCount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getPricePerHour() { return pricePerHour; }
    public void setPricePerHour(BigDecimal pricePerHour) { this.pricePerHour = pricePerHour; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getOpenFrom() { return openFrom; }
    public void setOpenFrom(String openFrom) { this.openFrom = openFrom; }

    public String getOpenTo() { return openTo; }
    public void setOpenTo(String openTo) { this.openTo = openTo; }

    public static ParkingLotDTO fromEntity(ParkingLot lot) {
        if (lot == null) {
            return null;
        }
        ParkingLotDTO dto = new ParkingLotDTO();
        dto.setId(lot.getParkingLotId());
        dto.setName(lot.getName());
        dto.setAddress(lot.getAddress());
        dto.setLatitude(lot.getLatitude());
        dto.setLongitude(lot.getLongitude());
        dto.setPlacesCount(lot.getPlacesCount());
        dto.setReservablePlacesCount(lot.getReservablePlacesCount());
        if (lot.getPlacesCount() != null && lot.getReservablePlacesCount() != null) {
            dto.setWalkInPlacesCount(Math.max(0, lot.getPlacesCount() - lot.getReservablePlacesCount()));
        }
        dto.setStatus(lot.getStatus());
        if (lot.getOpenFrom() != null) dto.setOpenFrom(lot.getOpenFrom().toString());
        if (lot.getOpenTo() != null) dto.setOpenTo(lot.getOpenTo().toString());
        return dto;
    }
}
