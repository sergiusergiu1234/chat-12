package com.StefanSergiu.springchat.controller;

import com.StefanSergiu.springchat.auth.AuthenticationRequest;
import com.StefanSergiu.springchat.auth.AuthenticationResponse;
import com.StefanSergiu.springchat.auth.AuthenticationService;
import com.StefanSergiu.springchat.auth.RegisterRequest;
import com.StefanSergiu.springchat.config.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000","https://chat-12.vercel.app"})
public class AuthenticationController {

    private final AuthenticationService service;
    private final JwtService jwtService;
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        return ResponseEntity.ok(service.authenticate(request));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        service.refreshToken(request, response);
    }




}
