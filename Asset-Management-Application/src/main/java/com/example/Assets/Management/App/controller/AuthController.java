package com.example.Assets.Management.App.controller;

import com.example.Assets.Management.App.Enums.Role;
import com.example.Assets.Management.App.Enums.Status;
import com.example.Assets.Management.App.model.Users;
import com.example.Assets.Management.App.repository.UserRepository;
import com.example.Assets.Management.App.security.JwtUtil;
import com.example.Assets.Management.App.service.EmailService;
import com.example.Assets.Management.App.service.OtpService;
import com.example.Assets.Management.App.service.SmsService;
import com.example.Assets.Management.App.service.GoogleOAuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.servlet.http.HttpServletRequest;


import java.util.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Auth", description = "Auth APIs")
@SecurityRequirement(name = "bearerAuth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SmsService smsService;

    @Autowired
    private JwtUtil jwtUtil;
    
    @Autowired
    private GoogleOAuthService googleOAuthService;

    /**
     * Get client IP address
     */
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0];
        }
        return request.getRemoteAddr();
    }

    @PostMapping("/register")
    @Operation(summary = "User Registeration")
    public Map<String, Object> register(@RequestBody Users user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return Map.of("error", "User with this email already exists.");
        }
    
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        if (user.getRole() == null) user.setRole(Role.USER);
        userRepository.save(user);
    
        // Send welcome email and SMS
        try {
            emailService.sendWelcomeEmail(user.getEmail(), user.getName(), user.getRole());
        // smsService.sendWelcomeSms(user.getMobileNumber(), user.getName(), user.getRole()); // Ensure phone field exists in Users
        } catch (Exception e) {
            // TODO: handle exception
            e.printStackTrace();
            System.out.println("Some Issue on mail service");
        }
        
    
        String token = jwtUtil.generateToken(user.getEmail());
    
        return Map.of(
            "token", token,
            "user", Map.of("id", user.getId(), "email", user.getEmail(), "name", user.getName(), "role", user.getRole())
        );
    }

    @PostMapping("/login")
    @Operation(summary = "User Login")
    public Map<String, Object> login(@RequestBody Map<String, String> loginData) {
        System.err.println("loginData: " + loginData);
        
        // Authenticate first - this will throw AuthenticationException if credentials are wrong
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginData.get("email"), 
                loginData.get("password")
            )
        );

        // If authentication succeeds, proceed
        Users user = userRepository.findByEmail(loginData.get("email"))
            .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getStatus()!= Status.Active ) {
                throw new RuntimeException("User account is not active");
            }

        String token = jwtUtil.generateToken(user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        return Map.of(
            "token", token,
            "refreshToken", refreshToken,
            "user", Map.of(
                "id", user.getId(), 
                "email", user.getEmail(), 
                "name", user.getName(), 
                "role", user.getRole()
            )
        );
    }

    @GetMapping("/user")
    @Operation(summary = "Get User With AuthKey")
    public Map<String, Object> getUserDetails(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();

        // Now fetch your own Users entity from the database
        Users users = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("User not found")); // Make sure this method exists

        return Map.of(
            "id", users.getId(),
            "email", users.getEmail(),
            "name", users.getName(),
            "role", users.getRole()
        );
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request OTP for password reset")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @RequestBody Map<String, String> payload,
            HttpServletRequest request) {
        try {
            String email = payload.get("email");
            String ipAddress = getClientIp(request);

            String message = otpService.generateAndSendOtp(email, ipAddress);

            return ResponseEntity.ok(Map.of("message", message));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Something went wrong. Please try again."));
        }
    }

    @PostMapping("/resend-otp")
    @Operation(summary = "Resend OTP")
    public ResponseEntity<Map<String, String>> resendOtp(
            @RequestBody Map<String, String> payload,
            HttpServletRequest request) {
        // Same as forgot-password
        return forgotPassword(payload, request);
    }

    @PostMapping("/validate-otp")
    @Operation(summary = "Validate OTP")
    public ResponseEntity<Map<String, Object>> validateOtp(
            @RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String otp = payload.get("otp");

            boolean isValid = otpService.validateOtp(email, otp);

            if (isValid) {
                return ResponseEntity.ok(Map.of(
                        "isValid", true,
                        "message", "OTP validated successfully"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                        "isValid", false,
                        "error", "Invalid or expired OTP"
                ));
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "isValid", false,
                    "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestBody Map<String, String> payload) {
        try {
            String email = payload.get("email");
            String otp = payload.get("otp");
            String newPassword = payload.get("newPassword");
            String confirmPassword = payload.get("confirmPassword");

            // Validate passwords match
            if (!newPassword.equals(confirmPassword)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Passwords do not match"));
            }

            // Validate password strength
            if (newPassword.length() < 8) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Password must be at least 8 characters"));
            }

            // Validate OTP one more time
            boolean isValid = otpService.validateOtp(email, otp);
            if (!isValid) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid or expired OTP"));
            }

            // Update password
            Users user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);

            return ResponseEntity.ok(Map.of(
                    "message", "Password has been reset successfully"
            ));

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to reset password"));
        }
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Refresh JWT Token")
    public Map<String, Object> refreshToken(@RequestBody Map<String, String> payload) {
        String refreshToken = payload.get("refreshToken");
        
        if (refreshToken == null || !jwtUtil.validateRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }
        
        String email = jwtUtil.getUsernameFromToken(refreshToken);
        userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String newToken = jwtUtil.generateToken(email);
        
        return Map.of(
            "data", Map.of(
                "token", newToken
            ),
            "message", "Token refreshed successfully"
        );
    }

    @PostMapping("/google-login")
    @Operation(summary = "Google OAuth Login")
    public Map<String, Object> googleLogin(@RequestBody Map<String, String> payload) {
        try {
            String idToken = payload.get("idToken");
            if (idToken == null || idToken.trim().isEmpty()) {
                return Map.of("error", "Google ID token is required");
            }

            // Verify Google token and get user
            Users user = googleOAuthService.verifyGoogleToken(idToken);

            if (user.getStatus() != Status.Active) {
                return Map.of("error", "User account is not active");
            }

            // Generate JWT tokens
            String token = jwtUtil.generateToken(user.getEmail());
            String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

            return Map.of(
                    "token", token,
                    "refreshToken", refreshToken,
                    "user", Map.of(
                            "id", user.getId(),
                            "email", user.getEmail(),
                            "name", user.getName(),
                            "role", user.getRole(),
                            "profilePicture", user.getProfilePicture() != null ? user.getProfilePicture() : "",
                            "authProvider", user.getAuthProvider()
                    )
            );
        } catch (RuntimeException e) {
            // Handle expected runtime issues like invalid token, user not found
            return Map.of("error", e.getMessage());
        } catch (Exception e) {
            // Handle unexpected errors
            return Map.of("error", "An unexpected error occurred");
        }
    }
}
