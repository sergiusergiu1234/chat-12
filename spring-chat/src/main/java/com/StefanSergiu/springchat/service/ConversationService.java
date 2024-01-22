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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
        Set<UserDTO> participants = new HashSet<>(newConversationDTO.getParticipants());
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
        Set<UserDTO> participants = new HashSet<>();
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
           for(String messageId : conversation.getMessageIds()){
               Optional<Message> message = messageRespository.findById(messageId);
               conversationDto.addMessage(message);
           }
           response.add(conversationDto);
        }
        return response;
    }
    public Message saveMessage(MessageDTO messageDTO, String conversationId){
        System.out.println(messageDTO.getContent());
        Message newMessage = Message.from(messageDTO);
        messageRespository.save(newMessage);
        Conversation conversation = conversationRepository.findById(conversationId).orElseThrow(()->
                new ConversationNotFoundException("Conversation with id "+conversationId +" not found"));
        conversation.addMessage(newMessage.getId());
        conversationRepository.save(conversation);
        return newMessage;
    }


}
