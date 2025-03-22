import React,{useState} from 'react'
import axios from 'axios'
import {useNavigate,Link} from 'react-router-dom'
const Register=()=>{
    const[username,setUsername]=useState('')
    const[email,setEmail]=useState('')
    const[password,setPassword]=useState('')
    const[confirmPassword,setConfirmPassword]=useState('')
    const[error,setError]=useState('')
    const[pass,setPass]=useState({length:false,upper:false,lower:false,special:false,})
    const[isFlipped,setIsFlipped]=useState(false)
    const navigate=useNavigate()
    const handlePasswordChange=(e)=>{
        const password=e.target.value
        setPassword(password)
        setPass({length: password.length >= 8,upper: /[A-Z]/.test(password),lower: /[a-z]/.test(password),special: /[@$!%*?&]/.test(password),})
    }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        if (password!==confirmPassword){
            setError('Passwords do not match')
            return;
        }
        try
        {
            await axios.post('https://loopchat-backend.vercel.app/api/accounts/register/', { username, email, password })
            alert('Registration successful!')
            navigate('/login')
        }
        catch(error)
        {
            console.error(error)
            alert('Registration failed!')
        }
    }
    return (
        <div id='register'>
            <div id='register-in' className={isFlipped?'flipped':''}>
                <span class='bg-animate1'></span>
                <div id='register-out1'>
                    <h2 id='top'>Create an account</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" id="text" placeholder="Enter A Unique Username" onChange={(e)=>setUsername(e.target.value)} required/>
                        <br />
                        <input type="email" id="email" placeholder="Enter Your Email" onChange={(e)=>setEmail(e.target.value)} required/>
                        <br />
                        <input type="password" id="pass" placeholder="Password That Stands Unique" onChange={handlePasswordChange} required/>
                        <br />
                        <ul id="most">
                            <li style={{color:pass.upper?'green':'red'}}>At least One Uppercase Letter</li>
                            <li style={{color:pass.lower?'green':'red'}}>At least One Lowercase Letter</li>
                            <li style={{color:pass.special?'green':'red'}}>At least One Special Character</li>
                            <li style={{color:pass.length?'green':'red'}}>At least 8 Characters</li>
                        </ul>
                        <input type="password" id="pass2" placeholder="Confirm Your Password" onChange={(e)=>setConfirmPassword(e.target.value)} required/>
                        <br />
                        {error && <p style={{color:'red'}}>{error}</p>}
                        <button type="submit" id='b1'>Register</button>
                    </form>
                    <h5 id="bott">Already have an account?</h5>
                    <img id="boti" src="https://cdn-icons-png.flaticon.com/128/1828/1828395.png" alt="Login Image" />
                    <Link to='/login' id="bota" onClick={()=>setIsFlipped(true)}>Log In</Link>
                </div>
                <div id='register-out2'>
                    <h2 className='buet1'>Welcome Back</h2>
                    <p className='buet2'>Lorem ipsum dolor sit amet consectetur adipisicing elit!</p>
                </div>
            </div>
        </div>
    );
};

export default Register;
