package com.example.Assets.Management.App.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.Assets.Management.App.Enums.Role;

@Service
public class EmailService {
    private final BrevoEmailService brevoEmailService;
    
    @Value("${brevo.enabled:true}")
    private boolean brevoEnabled;

    public EmailService(BrevoEmailService brevoEmailService) {
        this.brevoEmailService = brevoEmailService;
    }

    public void sendEmail(String to, String subject, String text) {
        if (brevoEnabled) {
            String result = brevoEmailService.sendEmail(to, subject, text);
            System.out.println("Brevo API Response: " + result);
        } else {
            System.out.println("Email sending disabled - Brevo not configured");
        }
    }

    public void sendEmailWithCc(String to, List<String> cc, String subject, String text) {
        if (brevoEnabled) {
            String result = brevoEmailService.sendEmailWithCc(to, cc, subject, text);
            System.out.println("Brevo API Response: " + result);
        } else {
            System.out.println("Email sending disabled - Brevo not configured");
        }
    }

    public void sendEmailToMultipleRecipients(List<String> to, String subject, String text) {
        if (brevoEnabled) {
            String result = brevoEmailService.sendEmailToMultipleRecipients(to, subject, text);
            System.out.println("Brevo API Response: " + result);
        } else {
            System.out.println("Email sending disabled - Brevo not configured");
        }
    }

    public void sendWelcomeEmail(String toEmail, String name, Role role) {
        if (brevoEnabled) {
            String result = brevoEmailService.sendWelcomeEmail(toEmail, name, role);
            System.out.println("Brevo API Response: " + result);
        } else {
            System.out.println("Email sending disabled - Brevo not configured");
        }
    }

}
