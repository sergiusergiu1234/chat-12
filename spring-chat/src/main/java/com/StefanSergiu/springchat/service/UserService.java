package com.StefanSergiu.springchat.service;

import com.StefanSergiu.springchat.Document.Request;
import com.StefanSergiu.springchat.Document.User;
import com.StefanSergiu.springchat.dto.UserDTO;
import com.StefanSergiu.springchat.exception.UserNotFoundException;
import com.StefanSergiu.springchat.repository.RequestRepository;
import com.StefanSergiu.springchat.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService {


   private final UserRepository  userRepository;
    private final FriendshipService friendshipService;
private final ConversationService conversationService;
    private final RequestRepository requestRepository;


    public User getLoggedInUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user  = userRepository.findByUsername(username).orElseThrow(()->
                new UsernameNotFoundException("User not found: "+username));
        return user;
    }
    public List<UserDTO> getContacts(User user){
        List<UserDTO> contacts = new ArrayList<>();

        for (String contactId : user.getContacts()) {
            User contact = userRepository.findById(contactId)
                    .orElseThrow(()-> new UserNotFoundException("Usernot found with id " + contactId));
            contacts.add(UserDTO.from(contact));
        }
        return contacts;
    }


    @Transactional
    public Request sendFriendRequest(User loggedUser, String receiverId) {
        User receiver = userRepository.findById(receiverId).orElseThrow(()->new RuntimeException("User not found"));
        if (loggedUser.getId().equals(receiverId)) {
            throw new IllegalArgumentException("Cannot send a friend request to yourself.");
        }
        Request existingRequest = requestRepository.findBySenderAndReceiver(loggedUser.getId(), receiverId);
        if (existingRequest != null) {
            throw new IllegalStateException("You have already sent a friend request to this user.");
        }
        existingRequest = requestRepository.findBySenderAndReceiver(receiverId, loggedUser.getId());
        if (existingRequest != null) {
            // Call a method to accept the existing friend request (replace with your logic)
            acceptFriendRequest(existingRequest,receiver,loggedUser);
            return existingRequest;
        }
        Request newRequest = new Request();
        newRequest.setSender(loggedUser.getId());
        newRequest.setReceiver(receiverId);
        return requestRepository.save(newRequest);
    }

    @Transactional
    public boolean acceptFriendRequest(Request request,User user1, User user2 ){
        try {
            user1.addContact(user2.getId());
            user2.addContact(user1.getId());
            userRepository.save(user1);
            userRepository.save(user2);
            conversationService.createPrivateConversation(user1, user2);
            requestRepository.delete(request);
            return true;
        }catch (Exception e ){
            return false;
        }
    }

    public List<Request> getReceivedFriendRequests(User user){

        return requestRepository.findByReceiver(user.getId());
    }

    public List<Request> getSentFriendRequests(User user) {
        return requestRepository.findBySender(user.getId());
    }
}
