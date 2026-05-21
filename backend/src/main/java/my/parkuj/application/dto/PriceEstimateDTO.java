package my.parkuj.application.dto;

import java.math.BigDecimal;

public class PriceEstimateDTO {
    private Integer parkingLotId;
    private Double hours;
    private BigDecimal pricePerHour;
    private BigDecimal totalPrice;
    private String currency;

    public Integer getParkingLotId() { return parkingLotId; }
    public void setParkingLotId(Integer parkingLotId) { this.parkingLotId = parkingLotId; }

    public Double getHours() { return hours; }
    public void setHours(Double hours) { this.hours = hours; }

    public BigDecimal getPricePerHour() { return pricePerHour; }
    public void setPricePerHour(BigDecimal pricePerHour) { this.pricePerHour = pricePerHour; }

    public BigDecimal getTotalPrice() { return totalPrice; }
    public void setTotalPrice(BigDecimal totalPrice) { this.totalPrice = totalPrice; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}

