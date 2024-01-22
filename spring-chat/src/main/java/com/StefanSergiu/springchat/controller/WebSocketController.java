package com.StefanSergiu.springchat.controller;

import com.StefanSergiu.springchat.dto.MessageDTO;
import com.StefanSergiu.springchat.service.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {


    @Autowired
    private  ConversationService conversationService;

    @MessageMapping("/chat/{conversationId}")
    @SendTo("/topic/messages/{conversationId}")
    public MessageDTO handleReceivedMessage(@DestinationVariable String conversationId,@Payload MessageDTO message){
        conversationService.saveMessage(message,conversationId);
        return message;
    }
}
