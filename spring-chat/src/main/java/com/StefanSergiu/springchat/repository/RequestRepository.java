package com.StefanSergiu.springchat.repository;

import com.StefanSergiu.springchat.Document.Request;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RequestRepository extends MongoRepository<Request,String> {
    List<Request> findByReceiver(String receiver);

    List<Request> findBySender(String sender);

    boolean existsBySenderAndReceiver(String senderId, String receiverId);
    Request findBySenderAndReceiver(String senderId, String receiverId);
}
