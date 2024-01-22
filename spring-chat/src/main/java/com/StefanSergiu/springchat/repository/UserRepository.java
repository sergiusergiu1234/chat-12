package com.StefanSergiu.springchat.repository;

import com.StefanSergiu.springchat.Document.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User,String> {
    Optional<User> findById(String userId);
    Optional<User> findByUsername(String username);
    boolean existsByUsername(String username);

    List <User> findTop20By();
}
