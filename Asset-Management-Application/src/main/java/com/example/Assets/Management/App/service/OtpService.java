package com.example.Assets.Management.App.service;

import com.example.Assets.Management.App.model.OtpToken;
import com.example.Assets.Management.App.model.Users;
import com.example.Assets.Management.App.repository.OtpTokenRepository;
import com.example.Assets.Management.App.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.security.SecureRandom;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private OtpTokenRepository otpTokenRepository;

    @Autowired
    private SmsService smsService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 10;
    private static final int MAX_REQUESTS_PER_HOUR = 3;
    private static final int MAX_ATTEMPTS = 5;

    /**
     * Generate secure random OTP
     */
    private String generateSecureOTP() {
        SecureRandom random = new SecureRandom();
        int otp = random.nextInt(900000) + 100000; // 6-digit OTP
        return String.valueOf(otp);
    }

    /**
     * Check rate limiting (max 3 requests per hour)
     */
    public boolean checkRateLimit(Users user) {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        Long requestCount = otpTokenRepository.countRecentRequests(user, oneHourAgo);
        return requestCount < MAX_REQUESTS_PER_HOUR;
    }

    /**
     * Generate and send OTP
     */
    @Transactional
    public String generateAndSendOtp(String email, String ipAddress) {
        Optional<Users> userOptional = userRepository.findByEmail(email);

        // Don't reveal if email exists or not (security)
        if (userOptional.isEmpty()) {
            return "If this email exists, an OTP has been sent.";
        }

        Users user = userOptional.get();

        // Check rate limiting
        if (!checkRateLimit(user)) {
            throw new RuntimeException("Too many requests. Please try again after 1 hour.");
        }

        // Generate OTP
        String plainOtp = generateSecureOTP();
        String hashedOtp = passwordEncoder.encode(plainOtp);

        // Create OTP token
        OtpToken otpToken = new OtpToken();
        otpToken.setUser(user);
        otpToken.setOtpHash(hashedOtp);
        otpToken.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        otpToken.setIsUsed(false);
        otpToken.setAttempts(0);
        otpToken.setIpAddress(ipAddress);

        otpTokenRepository.save(otpToken);

        // Send email
        String subject = "Password Reset OTP";
        String message = String.format(
                "Dear %s,\n\n" +
                        "Your OTP for password reset is: %s\n\n" +
                        "This OTP will expire in %d minutes.\n\n" +
                        "If you didn't request this, please ignore this email.\n\n" +
                        "Do not share this OTP with anyone.",
                user.getName(), plainOtp, OTP_EXPIRY_MINUTES
        );

        emailService.sendEmail(email, subject, message);

        // For development only - REMOVE IN PRODUCTION
        System.out.println("OTP sent to " + email + ": " + plainOtp);

        return "If this email exists, an OTP has been sent.";
    }


    /**
     * Validate OTP
     */
    @Transactional
    public boolean validateOtp(String email, String plainOtp) {
        Optional<Users> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return false;
        }

        Users user = userOptional.get();

        // Get latest unused OTP
        Optional<OtpToken> otpTokenOptional =
                otpTokenRepository.findTopByUserAndIsUsedFalseOrderByCreatedAtDesc(user);

        if (otpTokenOptional.isEmpty()) {
            return false;
        }

        OtpToken otpToken = otpTokenOptional.get();

        // Check if expired
        if (otpToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            return false;
        }

        // Check attempt limit
        if (otpToken.getAttempts() >= MAX_ATTEMPTS) {
            throw new RuntimeException("Too many failed attempts. Please request a new OTP.");
        }

        // Verify OTP using password encoder
        boolean isValid = passwordEncoder.matches(plainOtp, otpToken.getOtpHash());

        if (!isValid) {
            // Increment attempts
            otpToken.setAttempts(otpToken.getAttempts() + 1);
            otpTokenRepository.save(otpToken);

            int remainingAttempts = MAX_ATTEMPTS - otpToken.getAttempts();
            if (remainingAttempts > 0) {
                throw new RuntimeException("Invalid OTP. " + remainingAttempts + " attempts remaining.");
            } else {
                throw new RuntimeException("Too many failed attempts. Please request a new OTP.");
            }
        }

        // Mark as used
        otpToken.setIsUsed(true);
        otpTokenRepository.save(otpToken);

        return true;
    }

    /**
     * Check if user has recently validated OTP (within last 5 minutes)
     * Used to verify user completed OTP validation before password reset
     */
    public boolean hasRecentlyValidatedOtp(String email) {
        Optional<Users> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            return false;
        }

        Users user = userOptional.get();
        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);

        // Find recently used OTP
        Optional<OtpToken> recentOtp = otpTokenRepository
                .findTopByUserAndIsUsedTrueOrderByCreatedAtDesc(user);

        return recentOtp.isPresent()
                && recentOtp.get().getCreatedAt().isAfter(fiveMinutesAgo);
    }

    /**
     * Cleanup expired OTPs (run this periodically)
     */
    @Transactional
    public void cleanupExpiredOtps() {
        LocalDateTime yesterday = LocalDateTime.now().minusDays(1);
        otpTokenRepository.findByIsUsedFalseAndExpiresAtBefore(yesterday)
                .forEach(otpTokenRepository::delete);
    }
}
