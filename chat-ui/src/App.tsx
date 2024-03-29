import React, { useEffect, useState } from 'react';
import Stomp from 'stompjs';
import './App.css';
import SockJS from 'sockjs-client';
import SockJsClient from 'react-stomp';
import ChatRoom from './pages/ChatRoom';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

// import PersistLogin from './component/PersistLogin';
import Navbar from './component/Navbar';
import { WebSocketProvider } from './context/WebSocketContext';
import NewGroup from './pages/NewGroup';
import StrangersList from './component/StrangersList';
import FriendsList from './component/FriendsList';
import RegisterPage from './pages/RegisterPage';
import FindPeople from './pages/FindPeople';
import FriendRequests from './pages/FriendRequests';
import axios from 'axios';
import PersistLogin from './component/PersistLogin';
import { AuthenticationContextProvider } from './context/authContext';


function App() {


  return (
    <div className="App">
        <AuthenticationContextProvider>
        <WebSocketProvider>
        <BrowserRouter>
          <Routes>
        
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage/>} />
            <Route
              path='/'
              element={<Navigate to='/app' replace />}
            />
            <Route element={<PersistLogin />}>
                <Route path='/app' element={<ChatRoom />} />
                <Route path='/new-conversation' element={<NewGroup/>}/>
                <Route path='/find-people' element={<FindPeople/>}/>
                <Route path='/friends' element={<FriendsList/>}/>
                <Route path='/friend-requests' element={<FriendRequests/>} />
            </Route>
 
          </Routes>
        </BrowserRouter>
        </WebSocketProvider>
     
   </AuthenticationContextProvider>
    </div>
  );
}

export default App;
