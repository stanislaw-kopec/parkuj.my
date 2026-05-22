package my.parkuj.application.dto;

import my.parkuj.application.model.Vehicle;

public class VehicleDTO {
    private Integer id;
    private Integer vehicleId;
    private Integer customerId;
    private String name;
    private String plateNumber;
    private String countryCode;
    private boolean primaryVehicle;
    private boolean primary;
    private boolean hasActiveReservation;

    public Integer getId() { return id; }
    public void setId(Integer id) {
        this.id = id;
        this.vehicleId = id;
    }

    public Integer getVehicleId() { return vehicleId; }
    public void setVehicleId(Integer vehicleId) {
        this.vehicleId = vehicleId;
        this.id = vehicleId;
    }

    public Integer getCustomerId() { return customerId; }
    public void setCustomerId(Integer customerId) { this.customerId = customerId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPlateNumber() { return plateNumber; }
    public void setPlateNumber(String plateNumber) { this.plateNumber = plateNumber; }

    public String getCountryCode() { return countryCode; }
    public void setCountryCode(String countryCode) { this.countryCode = countryCode; }

    public boolean isPrimaryVehicle() { return primaryVehicle; }
    public void setPrimaryVehicle(boolean primaryVehicle) {
        this.primaryVehicle = primaryVehicle;
        this.primary = primaryVehicle;
    }

    public boolean isPrimary() { return primary; }
    public void setPrimary(boolean primary) {
        this.primary = primary;
        this.primaryVehicle = primary;
    }

    public boolean isHasActiveReservation() { return hasActiveReservation; }
    public void setHasActiveReservation(boolean hasActiveReservation) { this.hasActiveReservation = hasActiveReservation; }

    public static VehicleDTO fromEntity(Vehicle vehicle) {
        if (vehicle == null) {
            return null;
        }
        VehicleDTO dto = new VehicleDTO();
        dto.setId(vehicle.getVehicleId());
        dto.setCustomerId(vehicle.getCustomer() != null ? vehicle.getCustomer().getCustomerId() : null);
        dto.setName(vehicle.getPlateNumber());
        dto.setPlateNumber(vehicle.getPlateNumber());
        dto.setCountryCode(vehicle.getCountryCode());
        dto.setPrimaryVehicle(vehicle.isPrimaryVehicle());
        return dto;
    }
}
