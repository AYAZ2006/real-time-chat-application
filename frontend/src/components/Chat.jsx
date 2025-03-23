import React, { useState, useEffect } from 'react';

function Chat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState('');
  const username = localStorage.getItem('username'); 
  useEffect(() => {
    if (!receiver) {
      const userReceiver = prompt('Enter your buddy name');
      if (userReceiver) {
        setReceiver(userReceiver);
      }
    }
  }, [receiver]);

  useEffect(() => {
    if (username && receiver) {
      fetchMessages();
    }
  }, [username, receiver]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/accounts/postmessages/${username}/${receiver}/`);

      if (!response.ok) {
        throw new Error("Failed to fetch messages.");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setMessages(data)
      } else {
        setMessages([])
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!message) {
      alert("Message cannot be empty!");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/accounts/postmessages/${username}/${receiver}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (response.status === 201) {
        setMessage('')
        fetchMessages()
      }
    } catch (error) {
      console.error("Error posting message:", error)
    }
  }

  return (
    <div>
      <h1>Chat with {receiver}</h1>
      <div style={{ height: '560px', width: 'auto', overflowY: 'auto', padding: '10px' }}>
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index}style={{backgroundColor: msg.sender === username ? 'white' : '#081b29',padding: '10px',color: msg.sender === username ? 'black' : 'white',borderRadius: '10px',maxWidth: '30%',textAlign: msg.sender === username ? 'left' : 'right',margin: msg.sender === username ? '0 0 10px auto' : '0 auto 10px 0',}}>
              <div>{msg.message}</div>
              <div style={{ fontSize: '12px', color: 'blue' }}>{msg.timestamp}</div>
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>
      <div>
        <form onSubmit={handleSendMessage} style={{ height: '45px', width: '900px' }}>
          <input value={message}onChange={(e) => setMessage(e.target.value)}onKeyDown={(e) => { if (e.key === 'Enter' && message.trim() !== '') handleSendMessage(e); }}placeholder="Type your message here..."style={{height: '45px',width: '900px',borderRadius: '50px',marginTop: '10px',marginLeft: '80px',fontWeight: 'bold',textIndent: '20px',fontSize: '15px',}}/>
        </form>
      </div>
    </div>
  );
}

export default Chat;
