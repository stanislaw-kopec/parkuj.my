package my.parkuj.application.controller;

import my.parkuj.application.dto.CustomerDTO;
import my.parkuj.application.service.CustomerService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    // Konsekwentnie z resztą API: customerId przekazujemy jako query param
    // (zamiast wyciągać z JWT — JWT będzie w kolejnej iteracji).
    @GetMapping("/me")
    public CustomerDTO getMe(@RequestParam Integer customerId) {
        return customerService.getCurrentCustomer(customerId);
    }

    @PutMapping("/me")
    public CustomerDTO updateMe(@RequestParam Integer customerId, @RequestBody CustomerDTO updates) {
        return customerService.updateCurrentCustomer(customerId, updates);
    }
}
