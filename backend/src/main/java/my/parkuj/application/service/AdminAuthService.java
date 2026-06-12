package my.parkuj.application.service;

import java.time.LocalDateTime;
import java.util.Locale;
import my.parkuj.application.dto.AdminUserDTO;
import my.parkuj.application.dto.LoginRequestDTO;
import my.parkuj.application.model.AdminUser;
import my.parkuj.application.repository.AdminUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AdminAuthService {

    // US-A01: 3 nieudane próby logowania → blokada konta na 15 minut.
    private static final int MAX_FAILED_ATTEMPTS = 3;
    private static final int LOCKOUT_MINUTES = 15;

    private final AdminUserRepository adminUserRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AdminAuthService(AdminUserRepository adminUserRepository) {
        this.adminUserRepository = adminUserRepository;
    }

    // Login admina — analogicznie do AuthService.login dla klientów, ale na tabeli admin_users.
    // noRollbackFor: zapis licznika nieudanych prób nie może być wycofany przez wyjątek 401.
    @Transactional(noRollbackFor = ResponseStatusException.class)
    public AdminUserDTO login(LoginRequestDTO request) {
        if (request == null || isBlank(request.getEmail()) || isBlank(request.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Podaj e-mail i hasło.");
        }
        String email = request.getEmail().trim().toLowerCase(Locale.ROOT);

        AdminUser admin = adminUserRepository.findByEmail(email)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nieprawidłowy e-mail lub hasło administratora."));

        if (admin.getLockedUntil() != null && admin.getLockedUntil().isAfter(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.LOCKED,
                "Konto tymczasowo zablokowane po zbyt wielu nieudanych próbach. Spróbuj ponownie później.");
        }

        boolean passwordOk = admin.getPasswordHash() != null
            && !admin.getPasswordHash().isBlank()
            && passwordEncoder.matches(request.getPassword(), admin.getPasswordHash());

        if (!passwordOk) {
            registerFailedAttempt(admin);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Nieprawidłowy e-mail lub hasło administratora.");
        }

        if ("INACTIVE".equalsIgnoreCase(admin.getStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Konto administratora jest nieaktywne.");
        }

        // Udane logowanie zeruje licznik i blokadę.
        if (admin.getFailedLoginAttempts() > 0 || admin.getLockedUntil() != null) {
            admin.setFailedLoginAttempts(0);
            admin.setLockedUntil(null);
            adminUserRepository.save(admin);
        }

        return AdminUserDTO.fromEntity(admin);
    }

    private void registerFailedAttempt(AdminUser admin) {
        int attempts = admin.getFailedLoginAttempts() + 1;
        admin.setFailedLoginAttempts(attempts);
        if (attempts >= MAX_FAILED_ATTEMPTS) {
            admin.setLockedUntil(LocalDateTime.now().plusMinutes(LOCKOUT_MINUTES));
            admin.setFailedLoginAttempts(0);
        }
        adminUserRepository.save(admin);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
