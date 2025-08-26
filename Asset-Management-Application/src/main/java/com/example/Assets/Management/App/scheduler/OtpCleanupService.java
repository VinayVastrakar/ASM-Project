package com.example.Assets.Management.App.scheduler;

import com.example.Assets.Management.App.repository.OtpTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDateTime;

@Service
public class OtpCleanupService {

    @Autowired
    private OtpTokenRepository otpTokenRepository;


    // Runs every day at midnight
//    @Scheduled(cron = "0 0 0 * * *")
//    public void cleanExpiredOtps() {
//        List<OtpToken> expiredTokens = otpTokenRepository.findAll().stream()
//                .filter(otp -> otp.getExpiry().isBefore(LocalDateTime.now()))
//                .toList();
//
//        otpTokenRepository.deleteAll(expiredTokens);
//        System.out.println("Cleaned up " + expiredTokens.size() + " expired OTPs");
//    }
    
    // Runs every day at noon (12 PM)
    @Scheduled(cron = "0 0 12 * * *")
    @Transactional
    public void cleanExpiredOtps() {
        try {
            int deletedCount = otpTokenRepository.deleteByExpiryBefore(LocalDateTime.now());
            System.out.println("Cleaned up " + deletedCount + " expired OTPs");
        } catch (Exception e) {
            System.err.println("Failed to clean expired OTPs: " + e.getMessage());
            e.printStackTrace();
        }
    }


}
