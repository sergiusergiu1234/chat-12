package com.StefanSergiu.springchat.dto;

import com.StefanSergiu.springchat.Document.Request;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SimpleRequestModel {
    private String requestId;
    private String senderId;
    private String receiverId;

    public static SimpleRequestModel from(Request request){
        if(request == null){
            return null;
        }
        SimpleRequestModel requestModel = new SimpleRequestModel();
        requestModel.setRequestId(request.getId());
        requestModel.setSenderId(request.getSender());
        requestModel.setReceiverId(request.getReceiver());
        return  requestModel;
    }
}
