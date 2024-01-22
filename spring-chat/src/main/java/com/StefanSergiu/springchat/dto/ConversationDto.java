package com.StefanSergiu.springchat.dto;

import com.StefanSergiu.springchat.Document.Conversation;
import com.StefanSergiu.springchat.Document.Message;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Getter
@Setter
public class ConversationDto {

    private String id;
    private Set<UserDTO> participants;
    private Set<Optional<Message>> messages = new HashSet<Optional<Message>>();;
    private Boolean isGroupChat;
    private String name;

    public void addMessage(Optional<Message> message){
        this.messages.add(message);
    }

    public static ConversationDto from(Conversation conversation){
        ConversationDto conversationDto = new ConversationDto();
        conversationDto.setId(conversation.getId());
        conversationDto.setParticipants(conversation.getParticipants());
        conversationDto.setIsGroupChat(conversation.getIsGroupChat());
        conversationDto.setName(conversation.getName());
        return conversationDto;
    }


}
