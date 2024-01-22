package com.StefanSergiu.springchat.controller;

import com.StefanSergiu.springchat.auth.AuthenticationRequest;
import com.StefanSergiu.springchat.auth.AuthenticationResponse;
import com.StefanSergiu.springchat.auth.AuthenticationService;
import com.StefanSergiu.springchat.auth.RegisterRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:3000")

public class AuthenticationController {

    private final AuthenticationService service;
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(service.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> login(@RequestBody AuthenticationRequest request) {
        AuthenticationResponse authenticationResponse = new AuthenticationResponse();
        return ResponseEntity.ok(service.authenticate(request));
    }

}
