package com.StefanSergiu.springchat.controller;

import com.StefanSergiu.springchat.Document.LeaveMessage;
import com.StefanSergiu.springchat.Document.User;
import com.StefanSergiu.springchat.config.JwtService;
import com.StefanSergiu.springchat.dto.MessageDTO;
import com.StefanSergiu.springchat.repository.UserRepository;
import com.StefanSergiu.springchat.service.ConversationService;
import com.StefanSergiu.springchat.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Controller
public class WebSocketController {


    @Autowired
    private  ConversationService conversationService;

    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepository;
    @Autowired
    JwtService jwtService;

    @MessageMapping("/chat/{conversationId}")
    @SendTo("/topic/messages/{conversationId}")
    public MessageDTO handleReceivedMessage(@DestinationVariable String conversationId,@Payload MessageDTO message){
        conversationService.saveMessage(message,conversationId);
        return message;
    }

    @MessageMapping("/chat/{conversationId}/leave")
    @SendTo("/topic/messages/{conversationId}")
    public MessageDTO leaveGroup(@DestinationVariable String conversationId,
                           @Payload LeaveMessage leaveMessage) {
        String token = leaveMessage.getToken();
        String username = jwtService.extractUsername(token);
        User user = userRepository.findByUsername(username).orElseThrow();
       boolean success =  conversationService.leaveConversation(conversationId, user.getId());
       if(success){
           System.out.println("A MERS");
           return  MessageDTO.builder()
                   .senderId("SYS")
                   .senderName("System")
                   .content(username+ " has left the chat.")
                   .timestamp(LocalDateTime.now())
                   .build();

       }else{
           return null;
       }
    }



}
