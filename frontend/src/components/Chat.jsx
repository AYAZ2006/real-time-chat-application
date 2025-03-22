import React, { useState, useEffect } from 'react';

function Chat() {
  const[message,setMessage]=useState('')
  const[messages,setMessages]=useState([])
  const[receiver,setReceiver]=useState('')
  const username=localStorage.getItem('username')
  let typingTimeout
  const handleTyping=(e)=>{
    localStorage.setItem("isTyping","true")
    clearTimeout(typingTimeout)
    typingTimeout=setTimeout(()=>{
      localStorage.setItem("isTyping","false")
    },2000)
  }
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
  }, [username, receiver])
  const handleReaction=(messageId, emoji)=>{
    setMessages((prevMessages)=>
      prevMessages.map((msg)=>
        msg.id === messageId?{ ...msg, reaction: emoji}:msg
      )
    )
  }
  const fetchMessages = async () => {
    try {
      const responseSender = await fetch(`https://loopchat-backend.vercel.app/api/accounts/postmessages/${username}/${receiver}/`);
      const dataSender = await responseSender.json();
      
      const responseReceiver = await fetch(`https://loopchat-backend.vercel.app/api/accounts/postmessages/${receiver}/${username}/`);
      const dataReceiver = await responseReceiver.json();

      const allMessages = [...(dataSender.messages || []), ...(dataReceiver.messages || [])];
      setMessages(allMessages.sort((a, b) => a.id - b.id));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const groupMessagesByTime = (messages) => {
    let grouped = [];
    let lastGroup = [];
    let lastTimestamp = Date.now();

    messages.forEach((msg, index) => {
      let currentTimestamp = lastTimestamp + index * 60000;
      
      if (lastGroup.length === 0 || currentTimestamp - lastTimestamp < 300000) {
        lastGroup.push(msg);
      } else {
        grouped.push([...lastGroup]);
        lastGroup = [msg];
      }
      lastTimestamp = currentTimestamp;
    });

    if (lastGroup.length) grouped.push([...lastGroup]);
    return grouped;
  };

  const groupedMessages = groupMessagesByTime(messages);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!message) {
      alert("Message cannot be empty!");
      return;
    }
    try {
      const response = await fetch(`https://loopchat-backend.vercel.app/api/accounts/postmessages/${username}/${receiver}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (response.status === 201) {
        setMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error("Error posting message:", error);
    }
  };

  return (
    <div>
      <h1>Chat with {receiver}</h1>
      <div style={{ height: '560px', width: 'auto', overflowY: 'auto', padding: '10px' }}>
        {groupedMessages.length > 0 ? (
          groupedMessages.map((group, index) => (
            <div key={index} className="message-group border p-2 my-2 rounded-lg bg-gray-100">
              {group.map((msg, i) => (
                <div key={i} style={{backgroundColor: msg.receiver === username ? 'rgba(52, 115, 156, 0.8)' : '#081b29',padding: '10px',color:'white',borderRadius: '10px',maxWidth: '30%',textAlign: 'left',margin: msg.receiver === username ? '0 auto 10px 0' : '0 0 10px auto'}}>
                  {msg.message}
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
      </div>

      <div>
        <form onSubmit={handleSendMessage} style={{ height: '45px', width: '900px' }}>
          <input value={message} onChange={(e) => {setMessage(e.target.value);handleTyping()}} onKeyDown={(e) => { if (e.key === 'Enter' && message.trim() !== '') handleSendMessage(e); }}placeholder="Type your message here..." style={{ height: '45px', width: '900px', borderRadius: "50px", marginTop: "10px", marginLeft: "80px", fontWeight: 'bold', textIndent: '20px', fontSize: '15px' }}/>
        </form>
      </div>
    </div>
  );
}

export default Chat;
