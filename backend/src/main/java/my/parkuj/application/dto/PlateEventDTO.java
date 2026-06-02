package my.parkuj.application.dto;

import java.math.BigDecimal;
import my.parkuj.application.enums.BarrierDirection;

// DTO przychodzący z Python serwisu OCR
public class PlateEventDTO {
    private String plateNumber;
    private BigDecimal confidence;
    private Integer gateId;
    private BarrierDirection direction;
    private String imageUrl;

    public String getPlateNumber() { return plateNumber; }
    public void setPlateNumber(String plateNumber) { this.plateNumber = plateNumber; }

    public BigDecimal getConfidence() { return confidence; }
    public void setConfidence(BigDecimal confidence) { this.confidence = confidence; }

    public Integer getGateId() { return gateId; }
    public void setGateId(Integer gateId) { this.gateId = gateId; }

    public BarrierDirection getDirection() { return direction; }
    public void setDirection(BarrierDirection direction) { this.direction = direction; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}

