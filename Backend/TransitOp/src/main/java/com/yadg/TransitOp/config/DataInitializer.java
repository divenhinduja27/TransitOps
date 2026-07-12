package com.yadg.TransitOp.config;

import com.yadg.TransitOp.entity.Role;
import com.yadg.TransitOp.entity.User;
import com.yadg.TransitOp.repository.RoleRepository;
import com.yadg.TransitOp.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        // Seed Roles
        List<String> roleNames = Arrays.asList(
            "ROLE_FLEET_MANAGER",
            "ROLE_DRIVER",
            "ROLE_SAFETY_OFFICER",
            "ROLE_FINANCIAL_ANALYST"
        );

        for (String roleName : roleNames) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(Role.builder().name(roleName).build());
            }
        }

        // Seed default Fleet Manager user if none exists
        String defaultEmail = "admin@transitops.com";
        java.util.Optional<User> existingUserOpt = userRepository.findByEmail(defaultEmail);
        if (existingUserOpt.isEmpty()) {
            Role fleetManagerRole = roleRepository.findByName("ROLE_FLEET_MANAGER")
                .orElseThrow(() -> new RuntimeException("ROLE_FLEET_MANAGER not found"));

            User defaultAdmin = User.builder()
                .email(defaultEmail)
                .password(passwordEncoder.encode("admin123"))
                .firstName("Default")
                .lastName("Admin")
                .roles(new HashSet<>(Arrays.asList(fleetManagerRole)))
                .build();

            userRepository.save(defaultAdmin);
            System.out.println("Default Fleet Manager user created with encrypted password: " + defaultEmail);
        } else {
            User existingUser = existingUserOpt.get();
            if (!existingUser.getPassword().startsWith("$2a$")) {
                existingUser.setPassword(passwordEncoder.encode("admin123"));
                userRepository.save(existingUser);
                System.out.println("Default Fleet Manager user password upgraded to BCrypt hash.");
            }
        }
    }
}
