package com.example.Assets.Management.App.controller;

import com.example.Assets.Management.App.service.EmailService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
public class EmailTestController {
    
    private final EmailService emailService;
    
    public EmailTestController(EmailService emailService) {
        this.emailService = emailService;
    }
    
    @PostMapping("/send-email")
    public String sendTestEmail(@RequestParam String to, 
                               @RequestParam String subject, 
                               @RequestParam String message) {
        try {
            emailService.sendEmail(to, subject, message);
            return "Email sent successfully to " + to;
        } catch (Exception e) {
            return "Error sending email: " + e.getMessage();
        }
    }
    
    @PostMapping("/send-welcome")
    public String sendWelcomeEmail(@RequestParam String email, 
                                  @RequestParam String name, 
                                  @RequestParam String role) {
        try {
            com.example.Assets.Management.App.Enums.Role userRole = 
                "ADMIN".equalsIgnoreCase(role) ? 
                com.example.Assets.Management.App.Enums.Role.ADMIN : 
                com.example.Assets.Management.App.Enums.Role.USER;
                
            emailService.sendWelcomeEmail(email, name, userRole);
            return "Welcome email sent successfully to " + email;
        } catch (Exception e) {
            return "Error sending welcome email: " + e.getMessage();
        }
    }
}
