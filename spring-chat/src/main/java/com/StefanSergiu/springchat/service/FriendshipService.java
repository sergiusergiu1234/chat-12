package com.StefanSergiu.springchat.service;

import com.StefanSergiu.springchat.Document.User;
import com.StefanSergiu.springchat.repository.RequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FriendshipService {

    @Autowired
    RequestRepository requestRepository;
    public String getFriendshipStatus(User loggedUser, User otherUser){
        if(loggedUser == null){
            return "Invalid user";
        }
        if(loggedUser.getContacts().contains(otherUser.getId()) && otherUser.getContacts().contains(loggedUser.getId())){
            return "Friends";
        }
        if(hasSentFriendRequest(loggedUser.getId(), otherUser.getId())){
            return "Request sent";
        }
        if(hasReceivedFriendRequest(loggedUser.getId(), otherUser.getId())){
            return "Request received";
        }

        return "Not connected";
    }

    private boolean hasSentFriendRequest(String senderId, String receiverId) {
        return requestRepository.existsBySenderAndReceiver(senderId, receiverId);
    }

    private boolean hasReceivedFriendRequest(String receiverId, String senderId) {
        return requestRepository.existsBySenderAndReceiver(senderId, receiverId);
    }
}
