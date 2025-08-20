package com.example.Assets.Management.App.service;

import com.example.Assets.Management.App.Enums.Role;
import com.example.Assets.Management.App.Enums.Status;
import com.example.Assets.Management.App.model.Users;
import com.example.Assets.Management.App.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Optional;

@Service
public class GoogleOAuthService {

    @Autowired
    private UserRepository userRepository;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Users verifyGoogleToken(String idTokenString) {
        try {
            // Verify the token with Google
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idTokenString;
            String response = restTemplate.getForObject(url, String.class);
            
            if (response == null) {
                throw new RuntimeException("Failed to verify token with Google");
            }

            JsonNode tokenInfo = objectMapper.readTree(response);
            
            // Check if token is valid
            if (tokenInfo.has("error")) {
                throw new RuntimeException("Invalid Google token: " + tokenInfo.get("error").asText());
            }

            // Extract user information
            String email = tokenInfo.get("email").asText();
            String name = tokenInfo.get("name").asText();
            String picture = tokenInfo.has("picture") ? tokenInfo.get("picture").asText() : null;
            String userId = tokenInfo.get("sub").asText();
            boolean emailVerified = tokenInfo.get("email_verified").asBoolean();

            if (!emailVerified) {
                throw new RuntimeException("Email not verified with Google");
            }

            // Check if user exists
            Optional<Users> existingUser = userRepository.findByEmail(email);
            
            if (existingUser.isPresent()) {
                Users user = existingUser.get();
                // Update Google-specific fields if user exists
                user.setGoogleId(userId);
                user.setProfilePicture(picture);
                user.setAuthProvider("GOOGLE");
                return userRepository.save(user);
            } else {
                // Create new user
                Users newUser = new Users();
                newUser.setEmail(email);
                newUser.setName(name);
                newUser.setGoogleId(userId);
                newUser.setProfilePicture(picture);
                newUser.setAuthProvider("GOOGLE");
                newUser.setRole(Role.USER); // Default role
                newUser.setStatus(Status.Active);
                // Set a dummy password for Google users (they won't use it)
                newUser.setPassword("GOOGLE_AUTH_USER");
                
                return userRepository.save(newUser);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to verify Google token: " + e.getMessage());
        }
    }
}
