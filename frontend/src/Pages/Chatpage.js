import React, { useEffect, useState } from 'react';
import './chatpage.css';
import axios from 'axios';

const Chatpage = () => {
  const [chats, setChats] = useState([]);
  const [error, setError] = useState(null);

  const fetchChats = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/api/chat/allchat");
      console.log(response)
      setChats(response.data);
    } catch (error) {
      console.error("Error fetching chats:", error);
      setError(error);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
      <div className='Chatpage'>
          {chats.length > 0 ? (
              chats.map((chat, index) => (
              <div key={index}>{chat.chatName}</div>
            ))
            ) : (
                <div>No chats available</div>
          )}
    </div>
  );
};

export default Chatpage

