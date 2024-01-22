//package com.StefanSergiu.springchat.security;
//
//import com.StefanSergiu.springchat.Document.User;
//import com.StefanSergiu.springchat.dto.TokenDTO;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Qualifier;
//import org.springframework.security.authentication.BadCredentialsException;
//import org.springframework.security.core.Authentication;
//import org.springframework.security.oauth2.jwt.Jwt;
//import org.springframework.security.oauth2.jwt.JwtClaimsSet;
//import org.springframework.security.oauth2.jwt.JwtEncoder;
//import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
//import org.springframework.stereotype.Component;
//
//import java.text.MessageFormat;
//import java.time.Duration;
//import java.time.Instant;
//import java.time.temporal.ChronoUnit;
//
////@Component
//public class TokenGenerator {
////    @Autowired
//    JwtEncoder accessTokenEncoder;
//
////    @Autowired
////    @Qualifier("jwtRefreshTokenEncoder")
//    JwtEncoder refreshTokenEncoder;
//
//    private String createAccesToken(Authentication authentication){
//        User user = (User) authentication.getPrincipal();
//        Instant now = Instant.now();
//
//        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
//                .issuer("myApp")
//                .subject(user.getId())
//                .issuedAt(now)
//                .expiresAt(now.plus(5, ChronoUnit.MINUTES))
//                .build();
//        return accessTokenEncoder.encode(JwtEncoderParameters.from(claimsSet)).getTokenValue();
//    }
//
//
//    private String createRefreshToken(Authentication authentication){
//        User user = (User) authentication.getPrincipal();
//        Instant now = Instant.now();
//
//        JwtClaimsSet claimsSet = JwtClaimsSet.builder()
//                .issuer("myApp")
//                .subject(user.getId())
//                .issuedAt(now)
//                .expiresAt(now.plus(30, ChronoUnit.DAYS))
//                .build();
//        return refreshTokenEncoder.encode(JwtEncoderParameters.from(claimsSet)).getTokenValue();
//    }
//
//    public TokenDTO createToken(Authentication authentication){
//        System.out.println("Authentication Details:");
//        System.out.println("Principal: " + authentication.getPrincipal());
//        System.out.println("Credentials: " + authentication.getCredentials());
//        System.out.println("Authorities: " + authentication.getAuthorities());
//        System.out.println("Is Authenticated: " + authentication.isAuthenticated());
//        System.out.println("Details: " + authentication.getDetails());
//
//        if(!(authentication.getPrincipal() instanceof User user)){
//            throw new BadCredentialsException(
//                    MessageFormat.format("Principal {} is not of user type", authentication.getPrincipal().getClass())
//            );
//        }
//        TokenDTO tokenDTO = new TokenDTO();
//        tokenDTO.setUserId(user.getId());
//        tokenDTO.setAccessToken(createAccesToken(authentication));
//
//        String refreshToken;
//        if(authentication.getCredentials() instanceof Jwt jwt){
//            Instant now = Instant.now();
//            Instant expiresAt = jwt.getExpiresAt();
//            Duration duration = Duration.between(now, expiresAt);
//            long daysUntilExpired = duration.toDays();
//            if(daysUntilExpired < 7){
//                refreshToken = createRefreshToken(authentication);
//            }else{
//                refreshToken = jwt.getTokenValue();
//            }
//        }
//        tokenDTO.setRefreshToken(createRefreshToken(authentication));
//
//        return tokenDTO;
//    }
//}
