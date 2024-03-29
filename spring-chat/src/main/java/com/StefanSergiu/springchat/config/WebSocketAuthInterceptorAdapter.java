package com.StefanSergiu.springchat.config;

import com.StefanSergiu.springchat.auth.AuthenticationService;
import com.StefanSergiu.springchat.service.UserService;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessagingException;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;


@Component
@RequiredArgsConstructor
public class WebSocketAuthInterceptorAdapter implements ChannelInterceptor {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        final StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        StompCommand cmd = accessor.getCommand();
        if (StompCommand.CONNECT == cmd) {
            final String authHeader = accessor.getFirstNativeHeader("Authorization");
            final String jwt;
            final String username;

            if (authHeader != null && authHeader.startsWith("Bearer ")) {

                jwt = authHeader.substring(7);
                System.out.println(jwt);
                username = jwtService.extractUsername(jwt);

                if(username != null && SecurityContextHolder.getContext().getAuthentication() == null){
                    //get the UserDetails object based on the extracted username for validation
                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                    if(jwtService.isTokenValid(jwt,userDetails)){
                        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                userDetails,null,userDetails.getAuthorities()
                        );
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                        accessor.setUser(authenticationToken);

                    }else{
                        System.out.println("Token expired:" + jwtService.isTokenExpired(jwt));

                        throw new MessagingException("Invalid JWT token");
                    }
                }
            } else {
                throw new MessagingException("Invalid JWT token or missing");
            }
        }
        return message;
    }

}