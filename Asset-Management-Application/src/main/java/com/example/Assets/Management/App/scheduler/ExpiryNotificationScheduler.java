package com.example.Assets.Management.App.scheduler;

import com.example.Assets.Management.App.model.Asset;
import com.example.Assets.Management.App.model.PurchaseHistory;
import com.example.Assets.Management.App.model.Users;
import com.example.Assets.Management.App.repository.AssetRepository;
import com.example.Assets.Management.App.repository.PurchaseHistoryRepository;
import com.example.Assets.Management.App.repository.UserRepository;
import com.example.Assets.Management.App.service.EmailService;
// import com.example.Assets.Management.App.service.SmsService;
import com.example.Assets.Management.App.Enums.Role;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ExpiryNotificationScheduler {

    @Autowired
    private AssetRepository assetRepository;
    @Autowired
    private PurchaseHistoryRepository purchaseHistoryRepository;
    @Autowired
    private EmailService emailService;
    // @Autowired
    // private SmsService smsService;
    @Autowired
    private UserRepository userRepository;

    // Runs every day at 12:59 PM
    @Scheduled(cron = "0 59 12 * * ?")
    @Transactional(readOnly = true)
    public void checkExpiringAssets() {
        try {
            LocalDate now = LocalDate.now();
            LocalDate soon = now.plusDays(30);
            
            // Get all purchase histories that are expiring soon and have notifications enabled
            List<PurchaseHistory> expiringHistories = purchaseHistoryRepository.findByExpiryDateBetween(now, soon)
                .stream()
                .filter(history -> "Yes".equalsIgnoreCase(history.getNotify()))
                .collect(Collectors.toList());

            if (expiringHistories.isEmpty()) {
                System.out.println("No assets expiring in the next 30 days.");
                return;
            }

            // Get admin emails for CC
            List<String> adminEmails = userRepository.findByRole(Role.ADMIN)
                                        .stream()
                                        .map(Users::getEmail)
                                        .collect(Collectors.toList());

            if (adminEmails.isEmpty()) {
                System.err.println("Warning: No admin users found for CC notifications");
            }

            int notificationsSent = 0;
            for (PurchaseHistory history : expiringHistories) {
                Asset asset = history.getAsset();
                String subject = "Asset Expiry Alert: " + asset.getName();
                String baseText = String.format(
                    "The asset '%s' is expiring on %s\nPurchase Date: %s\nWarranty Period: %s months",
                    asset.getName(),
                    history.getExpiryDate(),
                    history.getPurchaseDate(),
                    history.getWarrantyPeriod()
                );

                try {
                    if (asset.getAssignedToUser() != null) {
                        // Case 1: Asset has assigned user - send to user with admins in CC
                        String userEmail = asset.getAssignedToUser().getEmail();
                        emailService.sendEmailWithCc(userEmail, adminEmails, subject, baseText);
                        
                        // Send SMS to assigned user if mobile number is available
                        // String mobileNumber = asset.getAssignedToUser().getMobileNumber();
                        // if (mobileNumber != null && !mobileNumber.trim().isEmpty()) {
                        //     String smsText = String.format("Asset '%s' expires on %s", 
                        //                                   asset.getName(), history.getExpiryDate());
                        //     smsService.sendSms(mobileNumber, smsText);
                        // }
                    } else {
                        // Case 2: Asset is unassigned - send only to admins
                        String adminText = baseText + "\n\nNote: This asset is currently unassigned.";
                        String adminSubject = "[Unassigned] " + subject;
                        emailService.sendEmailToMultipleRecipients(adminEmails, adminSubject, adminText);
                        // No SMS for unassigned assets
                    }
                    notificationsSent++;
                } catch (Exception emailException) {
                    System.err.println("Failed to send notification for asset: " + asset.getName() + 
                                     ". Error: " + emailException.getMessage());
                }
            }
            
            System.out.println("Successfully sent " + notificationsSent + " expiry notifications out of " + 
                             expiringHistories.size() + " expiring assets.");
            
        } catch (Exception e) {
            System.err.println("Failed to check expiring assets: " + e.getMessage());
            e.printStackTrace();
        }
    }
}