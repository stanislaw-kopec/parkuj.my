package my.parkuj.application.dto;

import java.math.BigDecimal;

public class ParkingLotCreateDTO {
    private Integer ownerCustomerId;
    private String name;
    private String address;
    private String city;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private Integer placesCount;
    private Integer reservablePlacesCount;
    private BigDecimal pricePerHour;

    public Integer getOwnerCustomerId() { return ownerCustomerId; }
    public void setOwnerCustomerId(Integer ownerCustomerId) { this.ownerCustomerId = ownerCustomerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

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

    private String openFrom;
    private String openTo;

    public String getOpenFrom() { return openFrom; }
    public void setOpenFrom(String openFrom) { this.openFrom = openFrom; }

    public String getOpenTo() { return openTo; }
    public void setOpenTo(String openTo) { this.openTo = openTo; }
}
