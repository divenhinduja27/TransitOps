package com.yadg.TransitOp.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class TestSecurityController {

    @GetMapping("/all")
    public ResponseEntity<String> authenticatedAccess() {
        return ResponseEntity.ok("Access granted: You are authenticated!");
    }

    @GetMapping("/manager")
    @PreAuthorize("hasAuthority('ROLE_FLEET_MANAGER')")
    public ResponseEntity<String> fleetManagerAccess() {
        return ResponseEntity.ok("Access granted: You have Fleet Manager role!");
    }

    @GetMapping("/driver")
    @PreAuthorize("hasAuthority('ROLE_DRIVER')")
    public ResponseEntity<String> driverAccess() {
        return ResponseEntity.ok("Access granted: You have Driver role!");
    }

    @GetMapping("/safety")
    @PreAuthorize("hasAuthority('ROLE_SAFETY_OFFICER')")
    public ResponseEntity<String> safetyOfficerAccess() {
        return ResponseEntity.ok("Access granted: You have Safety Officer role!");
    }

    @GetMapping("/analyst")
    @PreAuthorize("hasAuthority('ROLE_FINANCIAL_ANALYST')")
    public ResponseEntity<String> financialAnalystAccess() {
        return ResponseEntity.ok("Access granted: You have Financial Analyst role!");
    }
}
