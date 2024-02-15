package com.StefanSergiu.springchat.controller;
import com.StefanSergiu.springchat.Document.Conversation;
import com.StefanSergiu.springchat.Document.User;
import com.StefanSergiu.springchat.dto.ConversationDto;
import com.StefanSergiu.springchat.dto.NewConversationDTO;
import com.StefanSergiu.springchat.dto.UserDTO;
import com.StefanSergiu.springchat.repository.UserRepository;
import com.StefanSergiu.springchat.service.ConversationService;
import com.StefanSergiu.springchat.service.RequestService;
import com.StefanSergiu.springchat.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000","https://chat-12.vercel.app"})
public class UserController{

private final UserRepository userRepository;
private final UserService userService;
private final ConversationService conversationService;
private final RequestService requestService;

    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getAllUsers(){
        //get users list
        List<User> users = userRepository.findTop20By();
        List <UserDTO> userDTOs = new ArrayList<>();
        //check if we are logged in
        User loggedUser = userService.getLoggedInUser();
        if(loggedUser != null){
           for(User user: users){
               UserDTO userDTO = UserDTO.from(user);
               //to see if we sent/received a friend request to/from this user
               userDTO.setRequest(requestService.findBySenderAndReceiver(loggedUser.getId(),user.getId()));
               userDTO.setFriends(loggedUser.getContacts().contains(user.getId()));
               userDTOs.add(userDTO);
           }
            return ResponseEntity.ok(userDTOs);
        }else{
            for(User user: users){
                UserDTO userDTO = UserDTO.from(user);
                userDTO.setRequest(null);
                userDTOs.add(userDTO);
            }
        }
        return ResponseEntity.ok(userDTOs);
    }

    @GetMapping("/user/myData")
    public ResponseEntity<UserDTO> getMyData(){
        User user = userService.getLoggedInUser();
        UserDTO userDTO = UserDTO.from(user);
        return ResponseEntity.ok(userDTO);
    }


    @GetMapping("/getFriends")
    public ResponseEntity<List<UserDTO>> getContacts() {
        User user = userService.getLoggedInUser();
        return ResponseEntity.ok(userService.getContacts(user));
    }


    @PostMapping("/createConversation")
    public ResponseEntity<Conversation> createConversation (@RequestBody NewConversationDTO newConversationDTO) {
        Conversation conversation = conversationService.createConversation(newConversationDTO);
        return new ResponseEntity<>(conversation, HttpStatus.OK);
    }

    @GetMapping("/getConversations")
    public ResponseEntity<List<ConversationDto>> getConversations(){
        User user = userService.getLoggedInUser();
        List<ConversationDto> conversationList = conversationService.getConversations(user);
        return new ResponseEntity<>(conversationList,HttpStatus.OK);
    }


}
