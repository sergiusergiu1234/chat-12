package com.StefanSergiu.springchat.Document;

import com.StefanSergiu.springchat.dto.UserDTO;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Document
@Data
@RequiredArgsConstructor
@NoArgsConstructor
public class Conversation {

    @Id
    private String id;

    //references to participants of conversations
    @NonNull
    private List<UserDTO> participants;

    //list of message references
    private Set<String> messageIds = new HashSet<>();;

    private Boolean isGroupChat;

    private String name;

    public String addMessage(String messageId){
        this.messageIds.add(messageId);
        return  messageId;
    }

    public void removeParticipant(UserDTO user){
        this.participants.remove(user);
    }
}
