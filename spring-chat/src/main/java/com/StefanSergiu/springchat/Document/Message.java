package com.StefanSergiu.springchat.Document;


import com.StefanSergiu.springchat.dto.MessageDTO;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDateTime;

@Document
@Data
@RequiredArgsConstructor
@NoArgsConstructor
public class Message {

    @Id
    private String id;
    @NonNull
    private String senderId;
    private String senderName;
    @NonNull
    private String content;
//    @NonNull
//    private LocalDateTime timestamp;


    public static Message from(MessageDTO messageDTO){
        Message message = new Message();
        message.setContent(messageDTO.getContent());
        message.setSenderName(messageDTO.getSenderName());
        message.setSenderId(messageDTO.getSenderId());
        return message;
    }
}
