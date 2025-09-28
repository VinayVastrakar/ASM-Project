package com.example.Assets.Management.App.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BrevoEmailService {
    
    private final WebClient webClient;
    
    @Value("${brevo.api.key}")
    private String apiKey;
    
    @Value("${brevo.sender.email}")
    private String senderEmail;
    
    @Value("${brevo.sender.name}")
    private String senderName;

    public BrevoEmailService(@Value("${brevo.api.key}") String apiKey) {
        this.webClient = WebClient.builder()
                .baseUrl("https://api.brevo.com/v3")
                .defaultHeader("api-key", apiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    /**
     * Send transactional email using Brevo API
     * @param to recipient email
     * @param subject email subject
     * @param text email content
     * @return response from Brevo API
     */
    public String sendEmail(String to, String subject, String text) {
        Map<String, Object> requestBody = new HashMap<>();
        
        // Sender information
        Map<String, String> sender = new HashMap<>();
        sender.put("email", senderEmail);
        sender.put("name", senderName);
        requestBody.put("sender", sender);
        
        // Recipient information
        Map<String, String> toRecipient = new HashMap<>();
        toRecipient.put("email", to);
        requestBody.put("to", List.of(toRecipient));
        
        // Email content
        requestBody.put("subject", subject);
        requestBody.put("htmlContent", text);
        requestBody.put("textContent", text);

        return webClient.post()
                .uri("/smtp/email")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .onErrorResume(e -> Mono.just("Error: " + e.getMessage()))
                .block();
    }

    /**
     * Send email with CC recipients
     * @param to recipient email
     * @param cc list of CC recipients
     * @param subject email subject
     * @param text email content
     * @return response from Brevo API
     */
    public String sendEmailWithCc(String to, List<String> cc, String subject, String text) {
        Map<String, Object> requestBody = new HashMap<>();
        
        // Sender information
        Map<String, String> sender = new HashMap<>();
        sender.put("email", senderEmail);
        sender.put("name", senderName);
        requestBody.put("sender", sender);
        
        // Recipient information
        Map<String, String> toRecipient = new HashMap<>();
        toRecipient.put("email", to);
        requestBody.put("to", List.of(toRecipient));
        
        // CC recipients
        List<Map<String, String>> ccRecipients = cc.stream()
                .map(email -> {
                    Map<String, String> ccRecipient = new HashMap<>();
                    ccRecipient.put("email", email);
                    return ccRecipient;
                })
                .toList();
        requestBody.put("cc", ccRecipients);
        
        // Email content
        requestBody.put("subject", subject);
        requestBody.put("htmlContent", text);
        requestBody.put("textContent", text);

        return webClient.post()
                .uri("/smtp/email")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .onErrorResume(e -> Mono.just("Error: " + e.getMessage()))
                .block();
    }

    /**
     * Send email to multiple recipients
     * @param recipients list of recipient emails
     * @param subject email subject
     * @param text email content
     * @return response from Brevo API
     */
    public String sendEmailToMultipleRecipients(List<String> recipients, String subject, String text) {
        Map<String, Object> requestBody = new HashMap<>();
        
        // Sender information
        Map<String, String> sender = new HashMap<>();
        sender.put("email", senderEmail);
        sender.put("name", senderName);
        requestBody.put("sender", sender);
        
        // Multiple recipients
        List<Map<String, String>> toRecipients = recipients.stream()
                .map(email -> {
                    Map<String, String> recipient = new HashMap<>();
                    recipient.put("email", email);
                    return recipient;
                })
                .toList();
        requestBody.put("to", toRecipients);
        
        // Email content
        requestBody.put("subject", subject);
        requestBody.put("htmlContent", text);
        requestBody.put("textContent", text);

        return webClient.post()
                .uri("/smtp/email")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .onErrorResume(e -> Mono.just("Error: " + e.getMessage()))
                .block();
    }

    /**
     * Send welcome email with role-specific content
     * @param toEmail recipient email
     * @param name recipient name
     * @param role user role
     * @return response from Brevo API
     */
    public String sendWelcomeEmail(String toEmail, String name, com.example.Assets.Management.App.Enums.Role role) {
        String subject = "Welcome to Asset Management App!";
        String message;

        if (role == com.example.Assets.Management.App.Enums.Role.ADMIN) {
            message = String.format("""
                <html>
                <body>
                    <h2>Welcome to Asset Management App!</h2>
                    <p>Dear Admin <strong>%s</strong>,</p>
                    <p>Welcome! Your administrative access has been created successfully.</p>
                    <p>You can now:</p>
                    <ul>
                        <li>Manage all assets</li>
                        <li>Add/edit users</li>
                        <li>View system reports</li>
                        <li>Configure system settings</li>
                    </ul>
                    <p>Best regards,<br>Asset Management Team</p>
                </body>
                </html>
                """, name);
        } else {
            message = String.format("""
                <html>
                <body>
                    <h2>Welcome to Asset Management App!</h2>
                    <p>Hello <strong>%s</strong>,</p>
                    <p>Welcome! Your user account has been registered successfully.</p>
                    <p>You can now:</p>
                    <ul>
                        <li>View assigned assets</li>
                        <li>Update asset information</li>
                        <li>Request asset transfers</li>
                        <li>View your asset history</li>
                    </ul>
                    <p>Best regards,<br>Asset Management Team</p>
                </body>
                </html>
                """, name);
        }

        return sendEmail(toEmail, subject, message);
    }
}
