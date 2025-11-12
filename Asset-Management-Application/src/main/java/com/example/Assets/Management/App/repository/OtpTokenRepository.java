package com.example.Assets.Management.App.repository;

import com.example.Assets.Management.App.model.OtpToken;
import com.example.Assets.Management.App.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {

    // Find latest unused OTP for user
    Optional<OtpToken> findTopByUserAndIsUsedFalseOrderByCreatedAtDesc(Users user);

    // Count OTP requests in last hour for rate limiting
    @Query("SELECT COUNT(o) FROM OtpToken o WHERE o.user = ?1 AND o.createdAt > ?2")
    Long countRecentRequests(Users user, LocalDateTime since);

    // Find all unused OTPs for cleanup
    List<OtpToken> findByIsUsedFalseAndExpiresAtBefore(LocalDateTime expiry);

    int deleteByExpiryBefore(LocalDateTime dateTime);
}
