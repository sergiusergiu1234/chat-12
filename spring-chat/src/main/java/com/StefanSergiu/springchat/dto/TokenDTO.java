package com.StefanSergiu.springchat.dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenDTO {

    private String userId;
    private String accessToken;
    private String refreshToken;

}
