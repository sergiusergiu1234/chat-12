package com.StefanSergiu.springchat.dto;

import com.StefanSergiu.springchat.Document.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
//use this when searching people
//SimpleRequestModel is used to see the relationship between 2 users
//if request field is not null, we check who is the sender between the two
public class UserDTO {
    private String id;
    private String username;
    private boolean friends;
    private SimpleRequestModel request;

    public static UserDTO from(User user){
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        return userDTO;
    }
}
