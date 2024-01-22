package com.StefanSergiu.springchat.security;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.EncodedKeySpec;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Arrays;
import java.util.Objects;

@Component
@Slf4j
public class KeyUtils {
    @Autowired
    Environment environment;
    //to use RSA keys we need path to them
    //we stored paths in environment application.yml
    //we retrieve their values with @Value("${ **value** }")
    @Value("${access-token.private}")
    private String accessTokenPrivateKeyPath;
    @Value("${access-token.public}")
    private String accessTokenPublicKeyPath;
    @Value("${refresh-token.private}")
    private String refreshTokenPrivateKeyPath;
    @Value("${refresh-token.public}")
    private String refreshTokenPublicKeyPath;

    //save the refresh and access token key pairs
    // one kay pair =  private + public keys
    private KeyPair _accessTokenKeyPair;
    private KeyPair _refreshTokenKeyPair;

    private KeyPair getAccessTokenKeyPair(){
        //check if keypair is loaded or not
        //if is null, read from file or create new key pair
        if(Objects.isNull(_accessTokenKeyPair)){
            _accessTokenKeyPair = getKeyPair(accessTokenPublicKeyPath, accessTokenPrivateKeyPath);
        }
        return _accessTokenKeyPair;
    }
    private KeyPair getRefreshTokenKeyPair() {
        if (Objects.isNull(_refreshTokenKeyPair)) {
            _refreshTokenKeyPair = getKeyPair(refreshTokenPublicKeyPath, refreshTokenPrivateKeyPath);
        }
        return _refreshTokenKeyPair;
    }


    private KeyPair getKeyPair(String publicKeyPath, String privateKeyPath){
        KeyPair keyPair;
        File publicKeyFile = new File(publicKeyPath);
        File privateKeyFile = new File(privateKeyPath);

        //check if rsa key files exist
        //if they do, return the key pair and end the execution,
        // or else generate new keys and save them in a directory to read on future app runs
        if(publicKeyFile.exists() && privateKeyFile.exists()){
            log.info("loading keys from file: {}, {}", publicKeyPath, privateKeyPath);
            try{
                KeyFactory keyFactory = KeyFactory.getInstance("RSA");

                byte[] publicKeyBytes = Files.readAllBytes(publicKeyFile.toPath());
                EncodedKeySpec publicKeySpec = new X509EncodedKeySpec(publicKeyBytes);
                PublicKey publicKey =  keyFactory.generatePublic(publicKeySpec);

                 byte[] privateKeyBytes = Files.readAllBytes(privateKeyFile.toPath());
                 EncodedKeySpec privateKeySpec = new PKCS8EncodedKeySpec(privateKeyBytes);
                 PrivateKey privateKey = keyFactory.generatePrivate(privateKeySpec);

                keyPair = new KeyPair(publicKey,privateKey);
                 return keyPair;
            } catch (NoSuchAlgorithmException | IOException | InvalidKeySpecException e) {
                throw new RuntimeException(e);
            }
        }else{
            if (Arrays.stream(environment.getActiveProfiles()).anyMatch(s -> s.equals("prod"))) {
                throw new RuntimeException("public and private keys don't exist");
            }
        }

        //create directory if it doesn't exist
        File directory = new File("access-refresh-token-keys");
        if(!directory.exists()){
            directory.mkdirs();
        }

        //generate new keys and save them in files
        try{
            log.info("Generating new public and private keys: {}, {}", publicKeyPath, privateKeyPath);
            KeyPairGenerator keyPairGenerator = KeyPairGenerator.getInstance("RSA");
            keyPairGenerator.initialize(2048);
            keyPair = keyPairGenerator.generateKeyPair();

            try(FileOutputStream fos = new FileOutputStream(publicKeyPath)){
                X509EncodedKeySpec keySpec = new X509EncodedKeySpec(keyPair.getPublic().getEncoded());
                fos.write(keySpec.getEncoded());
            }
            try(FileOutputStream fos = new FileOutputStream(privateKeyPath)){
                PKCS8EncodedKeySpec keySpec = new PKCS8EncodedKeySpec(keyPair.getPrivate().getEncoded());
                fos.write(keySpec.getEncoded());
            }

        } catch (NoSuchAlgorithmException | IOException e) {
            throw new RuntimeException(e);
        }
        return keyPair;
    }
    //get RSA key methods
    public RSAPublicKey getAccessTokenPublicKey(){
        return (RSAPublicKey) getAccessTokenKeyPair().getPublic();
    }
    public RSAPrivateKey getAccessTokenPrivateKey(){
        return (RSAPrivateKey) getAccessTokenKeyPair().getPrivate();
    }
    public RSAPublicKey getRefreshTokenPublicKey(){
        return (RSAPublicKey) getRefreshTokenKeyPair().getPublic();
    }
    public RSAPrivateKey getRefreshTokenPrivateKey(){
        return (RSAPrivateKey) getRefreshTokenKeyPair().getPrivate();
    }
}
