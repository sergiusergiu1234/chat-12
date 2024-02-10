package com.StefanSergiu.springchat.repository;

import com.StefanSergiu.springchat.Document.Token;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TokenRepository extends MongoRepository<Token, String> {
   List<Token> findAllValidTokenByUserId(String id);
}
