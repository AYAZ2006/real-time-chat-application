import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate,Link} from 'react-router-dom';
const Login=()=>{
    const[username,setUsername]=useState('');
    const[password,setPassword]=useState('');
    const navigate=useNavigate();
    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            const response = await axios.post('https://loopchat-backend.vercel.app/api/accounts/login/',{username,password,});
            localStorage.setItem('username',username)
            alert(response.data.message);
            navigate('/home');
        }
        catch(error){
            console.error(error);
            alert('Login failed! Invalid credentials.');
        }
    };

    return(
        <div id='login'>
            <div id='login-in'>
            <span class='bg-animate1'></span>
                <h2 style={{color:'white',marginLeft:'50px',marginTop:'50px'}}>Welcome Again</h2>
                <div id='login-new'></div>
                <form onSubmit={handleSubmit}>
                    <input type="text" id='textnew' placeholder="Username" onChange={(e) => setUsername(e.target.value)} required/>
                    <br/>
                    <input type="password" id='passnew' placeholder="Password" onChange={(e) => setPassword(e.target.value)} required/>
                    <br/>
                    <button type="submit" id='bt'>Login</button>
                    <Link to='/reset' id='for'>Forgot Password?</Link>
                </form>
            </div>
        </div>
    );
};

export default Login;
