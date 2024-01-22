package com.StefanSergiu.springchat.dto;

import com.StefanSergiu.springchat.Document.User;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class NewConversationDTO {
    String id;
    String name;
    Boolean isGroupChat;
    Set<UserDTO> participants;
}
