package com.example.Assets.Management.App.scheduler;

import com.example.Assets.Management.App.repository.OtpTokenRepository;
import com.example.Assets.Management.App.service.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class OtpCleanupService {

    @Autowired
    private OtpService otpService;

    // Run every hour
    @Scheduled(cron = "0 0 * * * *")
    public void cleanupExpiredOtps() {
        otpService.cleanupExpiredOtps();
    }


}
