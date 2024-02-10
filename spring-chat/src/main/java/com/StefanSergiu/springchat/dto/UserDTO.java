package com.StefanSergiu.springchat.dto;

import com.StefanSergiu.springchat.Document.Request;
import com.StefanSergiu.springchat.Document.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserDTO {
    private String id;
    private String username;
    private boolean friends;
    private Request request;

    public static UserDTO from(User user){
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        return userDTO;
    }
}
