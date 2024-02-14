package com.StefanSergiu.springchat.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SeenMessage {
    private String messageId;
    private String userId;
    private String conversationId;
}
