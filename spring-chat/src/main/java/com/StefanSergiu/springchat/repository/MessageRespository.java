package com.StefanSergiu.springchat.repository;

import com.StefanSergiu.springchat.Document.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface MessageRespository extends MongoRepository<Message, String> {

}
