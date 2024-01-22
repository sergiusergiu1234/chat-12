package com.StefanSergiu.springchat.repository;

import com.StefanSergiu.springchat.Document.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface MessageRespository extends MongoRepository<Message, String> {
}
