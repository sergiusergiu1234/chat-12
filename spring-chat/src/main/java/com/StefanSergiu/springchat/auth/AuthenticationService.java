package com.StefanSergiu.springchat.auth;


import com.StefanSergiu.springchat.Document.Token;
import com.StefanSergiu.springchat.Document.User;
import com.StefanSergiu.springchat.config.JwtService;
import com.StefanSergiu.springchat.exception.UsernameAlreadyExistsException;
import com.StefanSergiu.springchat.repository.TokenRepository;
import com.StefanSergiu.springchat.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final TokenRepository tokenRepository;
    public AuthenticationResponse register(RegisterRequest request) {
        var check = userRepository.findByUsername(request.getUsername());
        if(check.isPresent()){
            throw new UsernameAlreadyExistsException("Username already exists!" + request.getUsername());
        }
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

       var savedUser =  userRepository.save(user);

        var jwtToken = jwtService.generateToken( user);
        var refreshToken = jwtService.generateRefreshToken(user);
        saveUserToken(savedUser, jwtToken);
        return AuthenticationResponse.builder().accessToken(jwtToken).refreshToken(refreshToken).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
       Authentication authentication= authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(),request.getPassword())
        );
        var user = userRepository.findByUsername(request.getUsername()).orElseThrow(
                ()-> new UsernameNotFoundException("Username was not found: " +request.getUsername())
        );
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user,jwtToken);
        return AuthenticationResponse.builder().accessToken(jwtToken).refreshToken(refreshToken).userId(user.getId()).username(request.getUsername()).build();
    }

    private void saveUserToken(User user, String jwtToken){
        var token = Token.builder()
                .token(jwtToken)
                .userId(user.getId())
                .revoked(false)
                .expired(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user){
        var validUserTokens = tokenRepository.findAllValidTokenByUserId(user.getId());
        for(Token token : validUserTokens){
            token.setRevoked(true);
            token.setExpired(true);
        }
        tokenRepository.saveAll(validUserTokens);
    }
    public void refreshToken( HttpServletRequest request,
                              HttpServletResponse response)
            throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String username;
        if(authHeader == null || !authHeader.startsWith("Bearer ")){
            return;
        }
        //"Bearer " is 7 long
        refreshToken = authHeader.substring(7);
        //extract username from JWT token;
        username = jwtService.extractUsername(refreshToken);

        if(username != null){
            //get the UserDetails object based on the extracted username for validation
            var userDetails = this.userRepository.findByUsername(username).orElseThrow();

            if(jwtService.isTokenValid(refreshToken,userDetails)){
                var accessToken = jwtService.generateToken(userDetails);
                revokeAllUserTokens(userDetails);
                saveUserToken(userDetails, accessToken);
                var authResponse = AuthenticationResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .build();

                System.out.println(accessToken);
                System.out.println(refreshToken);
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }
}
