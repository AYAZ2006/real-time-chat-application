import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Ai() {
    const[q,setQ]=useState('');
    const[loading,setLoading]=useState(false);
    const[isButton,setIsButton]=useState(true);
    const[message,setMessage]=useState([]);

    useEffect(()=>{
        setIsButton(q.trim().length === 0 || loading);
    }, [q,loading]);

    async function generate(prompt) {
        if (!prompt) return;
        setLoading(true);
        try{
            const response = await axios.post(
                'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCvicSkTE9HsC6zPzPFko75QWE2eDWEGJI',
                {contents:[{parts:[{text:prompt}]}]}
            );
            const result=response.data?.candidates?.[0]?.content?.parts?.[0]?.text||'No response';
            setMessage([...message,{role:'user',text:prompt},{role:'ai',text:result}]);
        }
        catch(error){
            setMessage([...message,{ role:'user',text:prompt},{role:'ai',text:'Failed to fetch response.'}]);
        }
        finally{
            setLoading(false);
            setQ('');
        }
    }
    const startListening=()=>{
        const SpeechRecognition=window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert('Your browser does not support speech recognition.');
            return;
        }
        const recog=new SpeechRecognition();
        recog.lang='en-US';
        recog.continuous=false;
        recog.interimResults=false;
        setIsListen(true);
        recog.start();
        recog.onresult=(event)=>{
            setQ(event.results[0][0].transcript);
        }
        recog.onend=()=>{
            setIsListen(false);
        }
        recog.onerror = (event) => {
            alert('Speech recognition error: ' + event.error);
            setIsListen(false);
        }
    }
    return (
        <div id='justfor'>
            <div id="outer-container">
                <div id="inner-container1"></div>
                <div id="inner-container2">
                    <div id="chat-container">
                        {message.map((msg, index) => (
                            <div key={index} className={msg.role==='user'?'user-chat-wrapper':'ai-chat-wrapper'}>
                                <div className={msg.role==='user'?'user-chat-box':'ai-chat-box'}>
                                    <div className={msg.role==='user'?'user-chat-area':'ai-chat-area'}>
                                        {loading&&index===message.length-1?<span id="loader"></span>:msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div id="text-area">
                        <textarea id="input-box" value={q} placeholder="Speak or Enter your prompt..." onChange={(e) => setQ(e.target.value)}></textarea>
                        <button id="generate-btn" onClick={() => generate(q)} disabled={isButton}>
                            <img src="https://cdn-icons-png.flaticon.com/128/6068/6068683.png" id="submit-img" alt="Submit" />
                        </button>
                        <button id="listen-btn" onClick={startListening}>🎤</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Ai;
