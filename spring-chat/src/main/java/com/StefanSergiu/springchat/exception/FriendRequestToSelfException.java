package com.StefanSergiu.springchat.exception;

public class FriendRequestToSelfException extends RuntimeException{
    public FriendRequestToSelfException(String message){super(message);}
}
