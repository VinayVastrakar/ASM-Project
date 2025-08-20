package com.example.Assets.Management.App.security;

import com.example.Assets.Management.App.model.Users;
import com.example.Assets.Management.App.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Users user = userRepository.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        // For Google users, we need to handle the password differently
        String password = "GOOGLE_AUTH_USER".equals(user.getPassword()) ? 
            "{noop}GOOGLE_AUTH_USER" : user.getPassword();
            
        return org.springframework.security.core.userdetails.User
            .withUsername(user.getEmail())
            .password(password)
            .roles(user.getRole().toString())
            .build();
    }
}
