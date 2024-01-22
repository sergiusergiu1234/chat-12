package com.StefanSergiu.springchat.repository;

import com.StefanSergiu.springchat.Document.Conversation;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends MongoRepository<Conversation,String> {
//    List<Conversation> findByParticipants(User user)
}
