package com.StefanSergiu.springchat.service;

import com.StefanSergiu.springchat.Document.Request;
import com.StefanSergiu.springchat.Document.User;
import com.StefanSergiu.springchat.repository.RequestRepository;
import com.StefanSergiu.springchat.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
public class RequestService {

    private final RequestRepository requestRepository;
    private final UserRepository userRepository;

    public Request findById(String requestId){
        return requestRepository.findById(requestId).orElseThrow(
                ()-> new RuntimeException("Request not found with id " + requestId));
    }

    public Request findBySenderAndReceiver(String userId1, String userId2){
        Request request = requestRepository.findBySenderAndReceiver(userId1, userId2);
        if (request != null) {
            return request;
        }
        // Try finding the request with userId1 as receiver and userId2 as sender
        return requestRepository.findBySenderAndReceiver(userId2, userId1);
    }
    @Transactional
    public Request deleteFriendRequest(User user, String strangerId){
        User stranger = userRepository.findById(strangerId).orElseThrow(()-> new RuntimeException("User not found with id "+ strangerId));
        try{
            Request request = requestRepository.findBySenderAndReceiver(user.getId(),strangerId);
            if(request == null){
               request =  requestRepository.findBySenderAndReceiver(strangerId, user.getId());
            }
            requestRepository.delete(request);
            return request;
        }catch (Exception e){
            System.out.println("SOmething happened");
        }
        return null;
    }
}
