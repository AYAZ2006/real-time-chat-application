import React,{useState} from 'react'
import {Link} from 'react-router-dom'
function Profile() {
    const[image,setImage]=useState(localStorage.getItem('profileImage') || null)
    const[Username,setUsername]=useState(localStorage.getItem('username'))
    const[isopen,setIsopen]=useState(false)
    const[islink1,setIslink1]=useState(false)
    const[islink2,setIslink2]=useState(false)
    const[islink3,setIslink3]=useState(false)
    const[newUsername,setNewUsername]=useState('')
    const[github,setGithub]=useState(localStorage.getItem('github') || '')
    const[linkedin,setLinkedin]=useState(localStorage.getItem('linkedin') || '')
    const[portfolio,setPortfolio]=useState(localStorage.getItem('portfolio') || '')
    const handleImageChange=(event)=>{
      const file=event.target.files[0]
      if (file){
        const reader=new FileReader()
        reader.onload=()=>{
          setImage(reader.result)
          localStorage.setItem('profileImage', reader.result)
        }
        reader.readAsDataURL(file)
      }
    }
    const handleUsername=(e)=>{
      setNewUsername(e.target.value)
    }
    const handleChanges = async () => {
      if (newUsername && newUsername !== Username) {
        setUsername(newUsername);
        localStorage.setItem("username", newUsername);
      }
      
      localStorage.setItem("github", github);
      localStorage.setItem("linkedin", linkedin);
      localStorage.setItem("portfolio", portfolio);
    
      try {
        const response = await fetch(`https://loopchat-backend.vercel.app/api/accounts/update-profile/${newUsername || Username}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            github: github,
            linkedin: linkedin,
            portfolio: portfolio
          })
        });
    
        const data = await response.json();
        if (response.ok) {
          alert("Changes saved successfully!")
        } else {
          alert("Error: " + data.error)
        }
      } catch (error) {
        console.error("Error saving profile:", error)
        alert("Something went wrong!")
      }
      setIsopen(false)
      setIslink1(false)
      setIslink2(false)
      setIslink3(false)
    }
    
  return (
    <div id='profile'>
        <div id='prof-image' style={{ backgroundImage: image ? `url(${image})` : "none" }}></div>
        <input type="file" id="imageUpload" accept="image/*" onChange={handleImageChange}></input>
        <label htmlFor="imageUpload" id='swap'>+</label>
        <h3 id='name'>username:{Username}
          <button id='change' onClick={()=>setIsopen(prev=>!prev)}>
            <img src='https://cdn-icons-png.flaticon.com/128/84/84380.png' id='change-pic'></img>
          </button>
        </h3>
        {isopen && <div id='open-1'>
          <input placeholder='Enter your new username...' id='change-name' value={newUsername} onChange={handleUsername}></input>
        </div>
        }
        <button id='animate' onClick={handleChanges}>Save</button>
        <h1 id='connect'>Enhance your connections through:</h1>
        <div id='social'>
          <h2 id='gits'>Github:</h2>
          <button id='change-gits' onClick={()=>setIslink1(prev=>!prev)}>
            <img src='https://cdn-icons-png.flaticon.com/128/84/84380.png' id='change-pic'></img>
          </button>
          <Link to={github} id='link-gits'>Github</Link>
          <h2 id='links'>Linked-in:</h2>
          <button id='change-links' onClick={()=>setIslink2(prev=>!prev)}>
            <img src='https://cdn-icons-png.flaticon.com/128/84/84380.png' id='change-pic'></img>
          </button>
          <Link to={linkedin} id='link-links'>Linked-In</Link>
          <h2 id='ports'>Portfolio:</h2>
          <button id='change-ports' onClick={()=>setIslink3(prev=>!prev)}>
            <img src='https://cdn-icons-png.flaticon.com/128/84/84380.png' id='change-pic'></img>
          </button>
          <Link to={portfolio} id='link-ports'>Portfolio</Link>
          {islink1 && <input placeholder='Enter your GitHub link...' id='in-gits' value={github} onChange={(e) => setGithub(e.target.value)} />}
          {islink2 && <input placeholder='Enter your Lined-In link...' id='in-links' value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />}     
          {islink3 && <input placeholder='Enter your Portfolio link...' id='in-ports' value={portfolio} onChange={(e) => setPortfolio(e.target.value)} />}        </div>
    </div>
  )
}

export default Profile
