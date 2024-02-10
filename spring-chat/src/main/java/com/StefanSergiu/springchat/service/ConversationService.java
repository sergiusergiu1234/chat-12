package com.StefanSergiu.springchat.service;

import com.StefanSergiu.springchat.Document.Conversation;
import com.StefanSergiu.springchat.Document.Message;
import com.StefanSergiu.springchat.Document.User;
import com.StefanSergiu.springchat.dto.ConversationDto;
import com.StefanSergiu.springchat.dto.MessageDTO;
import com.StefanSergiu.springchat.dto.NewConversationDTO;
import com.StefanSergiu.springchat.dto.UserDTO;
import com.StefanSergiu.springchat.exception.ConversationNotFoundException;
import com.StefanSergiu.springchat.exception.MessageNotFoundException;
import com.StefanSergiu.springchat.exception.UserNotFoundException;
import com.StefanSergiu.springchat.repository.ConversationRepository;
import com.StefanSergiu.springchat.repository.MessageRespository;
import com.StefanSergiu.springchat.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class ConversationService {

    @Autowired
    ConversationRepository conversationRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    MessageRespository messageRespository;


    @Transactional
    public Conversation createConversation(NewConversationDTO newConversationDTO){
        Conversation conversation = new Conversation();
        conversation.setIsGroupChat(newConversationDTO.getIsGroupChat());

        if(conversation.getIsGroupChat()){
            conversation.setName(newConversationDTO.getName());
        }else{
            conversation.setName(null);
        }
        List<UserDTO> participants = new ArrayList<>(newConversationDTO.getParticipants());
        conversation.setParticipants(participants);
        conversationRepository.save(conversation);
        for(UserDTO u: participants){
            User user = userRepository.findById(u.getId())
                    .orElseThrow(()-> new UserNotFoundException("User not found with id "+ u.getId() ));
            user.getConversations().add(conversation.getId());
            userRepository.save(user);
        }
        return conversation;
    }

    @Transactional
    public void createPrivateConversation(User user1, User user2) {
        Conversation conversation = new Conversation();
        conversation.setIsGroupChat(false);

        // Set participants for the private conversation
        List<UserDTO> participants = new ArrayList<>();
        participants.add(UserDTO.from(user1));
        participants.add(UserDTO.from(user2));
        conversation.setParticipants(participants);

        // Save the conversation to the database (or perform any other necessary actions)
        conversationRepository.save(conversation);

        // Update the user entities to include the new conversation
        user1.addConversation(conversation);
        user2.addConversation(conversation);

        // Save the updated user entities to the database
        userRepository.save(user1);
        userRepository.save(user2);

    }

    public List<ConversationDto> getConversations(User user){
        List<ConversationDto> response = new java.util.ArrayList<>(Collections.emptyList());
        Set<String> conversationList = user.getConversations();
        for(String id: conversationList){
            Conversation conversation = conversationRepository.findById(id)
                    .orElseThrow(()->new ConversationNotFoundException("Conversation not found  with id " + id));
            ConversationDto conversationDto = ConversationDto.from(conversation);
            List<Message> messages = messageRespository.findAllById(conversation.getMessageIds());
            conversationDto.setMessages(messages);
           response.add(conversationDto);
        }
        return response;
    }
    public Message saveMessage(MessageDTO messageDTO, String conversationId){
        System.out.println(messageDTO.getContent());
        Message newMessage = Message.from(messageDTO);
        newMessage.setTimestamp(LocalDateTime.now());

        messageRespository.save(newMessage);
        System.out.println(newMessage.getTimestamp());
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(()->
                new ConversationNotFoundException("Conversation with id "+conversationId +" not found"));
        conversation.addMessage(newMessage.getId());
        conversationRepository.save(conversation);
        return newMessage;
    }


    @Transactional
    public boolean leaveConversation(String conversationId, String userId) {
        Optional<Conversation> optionalConversation = conversationRepository.findById(conversationId);
        Optional<User> userOptional = userRepository.findById(userId);
        User user = userOptional.get();
        if(optionalConversation.isPresent()){
            Conversation conversation = optionalConversation.get();
            UserDTO userToRemove = findParticipantById(conversation.getParticipants(),userId);
            if(userToRemove != null){
                conversation.removeParticipant(userToRemove);
                conversationRepository.save(conversation);
                user.removeConversation(conversationId);
                userRepository.save(user);
                return true;
            }else{
                return false;
            }
        }
        return false;
    }

    private UserDTO findParticipantById(List<UserDTO> participants, String userId) {

        return participants.stream()
                .filter(userDTO -> userId.equals(userDTO.getId()))
                .findFirst()
                .orElse(null);
    }
}
