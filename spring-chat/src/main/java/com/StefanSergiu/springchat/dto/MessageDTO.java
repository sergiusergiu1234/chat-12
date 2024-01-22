package com.StefanSergiu.springchat.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MessageDTO {
    private String senderId;
    private String senderName;
    private String content;
}
