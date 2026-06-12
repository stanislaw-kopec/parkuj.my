package my.parkuj.application.config;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import my.parkuj.application.enums.AdminRole;
import my.parkuj.application.model.AdminUser;
import my.parkuj.application.model.ParkingLot;
import my.parkuj.application.model.PricingPlan;
import my.parkuj.application.repository.AdminUserRepository;
import my.parkuj.application.repository.ParkingLotRepository;
import my.parkuj.application.repository.PricingPlanRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    // Seed jest minimalny: dwa konta admina + 5 publicznych parkingów do prezentacji
    // listy klientowi. Nie tworzymy już klienta testowego, jego pojazdu, parkingu demo
    // ani 22 historycznych rezerwacji — wcześniejszy seed mylił widoki "obłożenie"
    // i wykresy przychodu, podsuwając dane których nikt nie umiał wyjaśnić.

    private final ParkingLotRepository parkingLotRepository;
    private final PricingPlanRepository pricingPlanRepository;
    private final AdminUserRepository adminUserRepository;

    public DataInitializer(
        ParkingLotRepository parkingLotRepository,
        PricingPlanRepository pricingPlanRepository,
        AdminUserRepository adminUserRepository
    ) {
        this.parkingLotRepository = parkingLotRepository;
        this.pricingPlanRepository = pricingPlanRepository;
        this.adminUserRepository = adminUserRepository;
    }

    @Override
    public void run(String... args) {
        if (adminUserRepository.count() == 0) {
            seedAdmins();
        }
        if (parkingLotRepository.count() == 0) {
            seedPublicParkingLots();
        }
    }

    private void seedAdmins() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

        AdminUser admin = new AdminUser();
        admin.setEmail("admin@parkuj.my");
        admin.setPasswordHash(encoder.encode("admin123"));
        admin.setRole(AdminRole.SUPERADMIN);
        admin.setStatus("ACTIVE");
        adminUserRepository.save(admin);

        AdminUser operator = new AdminUser();
        operator.setEmail("operator@parkuj.my");
        operator.setPasswordHash(encoder.encode("operator123"));
        operator.setRole(AdminRole.OPERATOR);
        operator.setStatus("ACTIVE");
        adminUserRepository.save(operator);
    }

    private void seedPublicParkingLots() {
        createParkingLot("Parking Zlote Tarasy",                     "ul. Zlota 59, Warszawa",                   "52.229700", "21.002900", 420, 120, "12.00");
        createParkingLot("Parking Centrum Nauki Kopernik",            "ul. Wybrzeze Kosciuszkowskie 20, Warszawa", "52.241900", "21.028800", 180,  60, "9.50");
        createParkingLot("Parking Arkadia",                           "al. Jana Pawla II 82, Warszawa",            "52.257000", "20.984700", 900, 250, "7.00");
        createParkingLot("Parking Mokotow Business Park",             "ul. Postepu 14, Warszawa",                  "52.179600", "20.999600", 260, 100, "8.50");
        createParkingLot("Parking Lotnisko Chopina",                  "ul. Zwirki i Wigury 1, Warszawa",           "52.165700", "20.967100", 650, 180, "15.00");
    }

    private ParkingLot createParkingLot(
        String name,
        String address,
        String latitude,
        String longitude,
        int placesCount,
        int reservablePlacesCount,
        String pricePerHour
    ) {
        ParkingLot parkingLot = new ParkingLot();
        parkingLot.setName(name);
        parkingLot.setAddress(address);
        parkingLot.setLatitude(new BigDecimal(latitude));
        parkingLot.setLongitude(new BigDecimal(longitude));
        parkingLot.setPlacesCount(placesCount);
        parkingLot.setReservablePlacesCount(reservablePlacesCount);
        parkingLot.setStatus("ACTIVE");
        parkingLot = parkingLotRepository.save(parkingLot);

        PricingPlan pricingPlan = new PricingPlan();
        pricingPlan.setParkingLot(parkingLot);
        pricingPlan.setPricePerHour(new BigDecimal(pricePerHour));
        pricingPlan.setCurrency("PLN");
        pricingPlan.setValidFrom(LocalDateTime.now());
        pricingPlanRepository.save(pricingPlan);

        return parkingLot;
    }
}
