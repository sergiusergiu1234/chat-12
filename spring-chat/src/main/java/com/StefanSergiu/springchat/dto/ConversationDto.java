package com.StefanSergiu.springchat.dto;

import com.StefanSergiu.springchat.Document.Conversation;
import com.StefanSergiu.springchat.Document.Message;
import lombok.Getter;
import lombok.Setter;

import java.util.*;

@Getter
@Setter
public class ConversationDto {

    private String id;
    private List <UserDTO> participants;
    private List<Message> messages = new ArrayList<>();;
    private Boolean isGroupChat;
    private String name;

    public void addMessage(Message message){
        this.messages.add(message);
    }

    public static ConversationDto from(Conversation conversation){
        ConversationDto conversationDto = new ConversationDto();
        conversationDto.setId(conversation.getId());
        conversationDto.setParticipants(conversation.getParticipants());
        conversationDto.setIsGroupChat(conversation.getIsGroupChat());


        return conversationDto;
    }


}
