package com.StefanSergiu.springchat.controller;

import com.StefanSergiu.springchat.Document.Request;
import com.StefanSergiu.springchat.Document.User;
import com.StefanSergiu.springchat.dto.FriendRequestResponse;
import com.StefanSergiu.springchat.dto.SimpleRequestModel;
import com.StefanSergiu.springchat.dto.UserDTO;
import com.StefanSergiu.springchat.exception.FriendRequestToSelfException;
import com.StefanSergiu.springchat.service.RequestService;
import com.StefanSergiu.springchat.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    @PostMapping("/sendFriendRequest/{id}")     //pass id of the requested user as a path variable
    public ResponseEntity<SimpleRequestModel> sendFriendRequest(@PathVariable final String id){
        User user = userService.getLoggedInUser();
        if(Objects.equals(user.getId(), id)){
            throw new FriendRequestToSelfException("User cannot send friend request to himself");
        }
        Request request =  userService.sendFriendRequest(user, id);
        return new ResponseEntity<>(SimpleRequestModel.from(request), HttpStatus.OK);
        }


    @DeleteMapping("/cancelFriendRequest/{requestId}")
    public ResponseEntity<SimpleRequestModel> cancelFriendRequest(@PathVariable final String requestId){
        User user = userService.getLoggedInUser();
        Request request = requestService.deleteFriendRequest(user, requestId);
        return new ResponseEntity<>(SimpleRequestModel.from(request), HttpStatus.OK);

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
//    @GetMapping("/getFriendRequests")
//    public ResponseEntity<List<FriendRequestDto>> getFriendRequests(){
//        User user = userService.getLoggedInUser();
//        List<Request> requestsList = userService.getReceivedFriendRequests(user);
//        List<FriendRequestDto> requestDtos = new ArrayList<>();
//        for(Request request: requestsList){
//            requestDtos.add(requestService.createFriendRequestDTO(request));
//        }
//        return new ResponseEntity<>(requestDtos,HttpStatus.OK);
//    }

}
