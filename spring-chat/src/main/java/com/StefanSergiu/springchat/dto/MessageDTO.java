package com.StefanSergiu.springchat.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.cglib.core.Local;

import java.sql.Timestamp;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder

public class MessageDTO {
    private String senderId;
    private String senderName;
    private String content;
    private LocalDateTime timestamp;
}
