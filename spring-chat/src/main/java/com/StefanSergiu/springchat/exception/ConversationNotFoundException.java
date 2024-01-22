package com.StefanSergiu.springchat.exception;

public class ConversationNotFoundException extends RuntimeException{
    public ConversationNotFoundException(String message) {super(message);}
}
