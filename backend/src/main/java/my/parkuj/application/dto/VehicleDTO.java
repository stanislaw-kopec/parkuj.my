package my.parkuj.application.dto;

import my.parkuj.application.model.Vehicle;

public class VehicleDTO {
    private Integer vehicleId;
    private String plateNumber;
    private String countryCode;
    private boolean isPrimary;

    public Integer getVehicleId() { return vehicleId; }
    public void setVehicleId(Integer vehicleId) { this.vehicleId = vehicleId; }

    public String getPlateNumber() { return plateNumber; }
    public void setPlateNumber(String plateNumber) { this.plateNumber = plateNumber; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

    public boolean isPrimary() { return isPrimary; }
    public void setPrimary(boolean primary) { isPrimary = primary; }

    public static VehicleDTO fromEntity(Vehicle vehicle) {
        if (vehicle == null) return null;
        VehicleDTO dto = new VehicleDTO();
        dto.vehicleId = vehicle.getVehicleId();
        dto.plateNumber = vehicle.getPlateNumber();
        dto.countryCode = vehicle.getCountryCode();
        dto.isPrimary = vehicle.isPrimary();
        return dto;
    }
}

