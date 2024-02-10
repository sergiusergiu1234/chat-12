package com.StefanSergiu.springchat.controller;

import com.StefanSergiu.springchat.Document.Request;
import com.StefanSergiu.springchat.Document.User;
import com.StefanSergiu.springchat.dto.UserDTO;
import com.StefanSergiu.springchat.exception.FriendRequestToSelfException;
import com.StefanSergiu.springchat.service.RequestService;
import com.StefanSergiu.springchat.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class FriendRequestController {

    private final UserService userService;
    private final RequestService requestService;
    private final SimpMessagingTemplate template;

    //return userDTO because we want to display other info about who sent the friend request

    @PostMapping("/sendFriendRequest/{id}")     //pass id of the requested user as a path variable
    public ResponseEntity<UserDTO> sendFriendRequest(@PathVariable final String id){
        User user = userService.getLoggedInUser();
        User receiver = userService.findUserById(id);
        if(Objects.equals(user.getId(), id)){
            throw new FriendRequestToSelfException("User cannot send friend request to himself");
        }
        Request request =  userService.sendFriendRequest(user, id);
        UserDTO userRef = UserDTO.from(user);
        userRef.setFriends(false);
        userRef.setRequest(request);
        template.convertAndSendToUser(
                receiver.getUsername(), "/queue/friend-requests",
                userRef);

        return new ResponseEntity<>(userRef, HttpStatus.OK);
        }


    @DeleteMapping("/cancelFriendRequest/{requestId}")
    public ResponseEntity<Request> cancelFriendRequest(@PathVariable final String requestId){
        User user = userService.getLoggedInUser();
        Request request = requestService.deleteFriendRequest(user, requestId);
        return new ResponseEntity<>(request, HttpStatus.OK);

    }

//    @PostMapping("/acceptFriendRequest/{requestId}")
//    public ResponseEntity<Boolean> addFriend( @PathVariable final String requestId){
//        User user = userService.getLoggedInUser();
//        return new ResponseEntity<>(userService.acceptFriendRequest(requestId), HttpStatus.OK);
//    }

//    @GetMapping("/getSentFriendRequests")
//    public ResponseEntity<List<FriendRequestDto>> getSentFriendRequests(){
//        User user = userService.getLoggedInUser();
//        List<Request> requestsList = userService.getSentFriendRequests(user);
//        List<FriendRequestDto> requestDtos = new ArrayList<>();
//        for(Request request: requestsList){
//            requestDtos.add(requestService.createFriendRequestDTO(request));
//        }
//        return new ResponseEntity<>(requestDtos,HttpStatus.OK);
//
//    }



    //return userReferences because we want to display other info about who sent the friend request
    @GetMapping("/getFriendRequests")
    public ResponseEntity<List<UserDTO>> getFriendRequests(){
        User user = userService.getLoggedInUser();
        List<Request> requestsList = userService.getReceivedFriendRequests(user);
        List<UserDTO> userReferences = new ArrayList<>();

        for(Request request : requestsList){
            User sender = userService.findUserById(request.getSender());
            UserDTO userRef = UserDTO.from(sender);
            userRef.setFriends(false);
            userRef.setRequest(request);
            userReferences.add(userRef);
            template.convertAndSendToUser(
                    user.getUsername(), "/queue/friend-requests",
                    request);
        }

        return new ResponseEntity<>(userReferences,HttpStatus.OK);
    }

}
