package com.StefanSergiu.springchat.Document;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document
public class Token {
    @Id
    public String id;

    @Indexed(unique = true)
    public String token;

    public boolean revoked;
    public boolean expired;

    public String userId;
}
