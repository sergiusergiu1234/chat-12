package com.StefanSergiu.springchat.auth;


import com.StefanSergiu.springchat.Document.User;
import com.StefanSergiu.springchat.config.JwtService;
import com.StefanSergiu.springchat.exception.UsernameAlreadyExistsException;
import com.StefanSergiu.springchat.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    public AuthenticationResponse register(RegisterRequest request) {
        var check = userRepository.findByUsername(request.getUsername());
        if(check.isPresent()){
            throw new UsernameAlreadyExistsException("Username already exists!" + request.getUsername());
        }
        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        userRepository.save(user);

        var jwtToken = jwtService.generateToken( user);
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
       Authentication authentication= authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(),request.getPassword())
        );
        //todo handle exception
        var user = userRepository.findByUsername(request.getUsername()).orElseThrow(
                ()-> new UsernameNotFoundException("Username was not found: " +request.getUsername())
        );
        var jwtToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder().token(jwtToken).userId(user.getId()).username(request.getUsername()).build();
    }


}
