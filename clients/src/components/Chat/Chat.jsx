import React, {useState,useEffect} from "react";
import queryString from 'query-string';
import { useLocation } from "react-router";
import { useNavigate } from "react-router";
import io from 'socket.io-client';
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";

import './Chat.css';

let socket;

const Chat =()=>{   
    const location = useLocation();
    const [name,setName] = useState('');
    const [room,setRoom] = useState('');
    const [users,setUsers] = useState('');
    const [message,setMessage] = useState('');
    const [messages,setMessages]= useState([]);
    const navigate = useNavigate();

    const ENDPOINT= "localhost:8001";

    useEffect(()=>{
        const {name,room} = queryString.parse(location.search);
        socket=io(ENDPOINT);
        setName(name);
        setRoom(room);

        socket.emit('join', { name, room }, (error) => {
            if(error) {
              alert(error);
              navigate('/');
            }
        });
        return ()=>{
            socket.disconnect();
            socket.off();
        }
    },[ENDPOINT,location.search,navigate]);

    useEffect(()=>{
        socket.on('message', (message) => {
            setMessages((prevMessages) => {
                const updatedMessages = [...prevMessages, message];
                console.log('New Message:', message);
                console.log('Updated Messages:', updatedMessages);
                return updatedMessages;
            });
        });
        socket.on("roomData", ({ users }) => {
            setUsers(users);
          });
        return () => {
            socket.off('message'); // Clean up the listener
        };
    },[]);

    //function for  sending message
    const sendMessage=(event)=>{
        event.preventDefault();
        if(message){
            socket.emit('sendMessage', message, ()=>setMessage(''))
        };
    }
    // console.log("messsage", message);
    // console.log("messages", messages);

    return (
        <div className="outerContainer">
            <div  className="Container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name} />
                <Input message={message} sendMessage={sendMessage} setMessage={setMessage} />
            </div>
            <TextContainer users={users}/>
        </div>
    )
}
export default Chat;