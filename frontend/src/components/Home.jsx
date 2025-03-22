import React, {useEffect,useState} from "react"
import {useNavigate} from "react-router-dom"
import Chat from "./Chat"
import Settings from "./Settings"
function Home() {
  const[isVisible,setIsVisible]=useState(false)
  const[add,setAdd]=useState(false)
  const[seen,setSeen]=useState(false)
  const[search,setSearch]=useState("")
  const[users,setUsers]=useState([])
  const[filteredUsers,setFilteredUsers]=useState([])
  const[requests,setRequests]=useState([])
  const navigate=useNavigate()
  const[acceptedFriends,setAcceptedFriends]=useState([])
  const[chatRoom,setChatRoom]=useState(null)
  const[isGenOpen,setIsGenOpen]=useState(false)
  const[isTyping,setIsTyping]=useState(false)
  useEffect(()=>{
    const checkTyping=()=>{
      setIsTyping(localStorage.getItem("isTyping")==="true")
    }
    checkTyping()
    const interval=setInterval(checkTyping, 200)
    return ()=>clearInterval(interval)
  },[])
  const handleOpenChat=(friend)=>{
    setChatRoom(friend)
  }
  useEffect(()=>{
    const fetchUsers=async()=>{
      try{
        const response=await fetch("https://loopchat-backend.vercel.app/api/accounts/search-users/")
        if (!response.ok){
          alert("Failed to fetch users")
        }
        const data=await response.json()
        setUsers(data)
        setFilteredUsers(data)
      }
      catch(error){
        alert("Error fetching users")
      }
    }
    fetchUsers()
  },[])

  const handleSearch=(e)=>{
    const value=e.target.value.toLowerCase()
    setSearch(value)
    setFilteredUsers(users.filter((user)=>user.username.toLowerCase().includes(value)))
  }

  const sendFriendRequest=async(receiverUsername)=>{
    try{
        const senderUsername=localStorage.getItem("username")
        console.log(senderUsername)
        if (!senderUsername){
            alert("You must enter your username!")
            return
        }
        const response=await fetch(`https://loopchat-backend.vercel.app/api/accounts/send-friend-request/${receiverUsername}/`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({sender:senderUsername})})
        if (!response.ok){
            alert("Failed to send request")
        }
        alert("Friend request sent!")
    }
    catch(error){
        alert("Error sending friend request")
    }
}

const username=localStorage.getItem("username")
window.onload = function() {
    const username = localStorage.getItem("username");
    fetch("https://loopchat-backend.vercel.app/api/accounts/see/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Username stored successfully:", data);
      })
      .catch((error) => {
        console.error("Error storing username:", error);
      });
  };
const handleReq=async()=>{
  const username=localStorage.getItem("username")
  if (!username){
      alert("Username is required!")
      return
  }
  try{
      const response=await fetch(`https://loopchat-backend.vercel.app/api/accounts/received-requests/${username}/`)
      if (!response.ok){
        pass
      }
      const data=await response.json()
      setRequests(data.received_requests||[])
      setSeen(true)
  }
  catch(error){
      alert("Error fetching friend requests")
  }
}
const handleRequestAction=async()=>{
  if (requests.length===0){
      alert("No pending requests!")
      return
  }
  const receiver=localStorage.getItem("username")
  if (!receiver){
      alert("Receiver username is required!")
      return
  }
  const sender=prompt("Enter the sender's username from the list:")
  if (!sender||!requests.some(req=>req.sender===sender)){
      alert("Invalid username! Choose from the list.")
      return
  }
  const action=prompt("Enter action: 'accept' or 'reject'").toLowerCase()
  if (action!=="accept" && action!=="reject"){
      alert("Invalid action! Enter 'accept' or 'reject'.")
      return
  }
  try{
      const response=await fetch(`https://loopchat-backend.vercel.app/api/accounts/friend-requests/${sender}/${action}/`,{method: "POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({receiver_username:receiver})})
      if (!response.ok){
        alert("Failed to process request")
      }
      if (action==="accept"){
          setAcceptedFriends(prev=>[...prev,sender])
      }
      setRequests(prev=>prev.filter(req=>req.sender!==sender))
      alert(`Friend request from ${sender} has been ${action}ed!`)
  }
  catch(error){
      alert("Error processing request")
  }
}
const added=async()=>{
  const username=localStorage.getItem("username")
  const response=await fetch(`https://loopchat-backend.vercel.app/api/accounts/accepted/${username}/`)
  const data=await response.json()
  setAcceptedFriends(data.friends || []);
}
useEffect(() => {
  added();
}, [])
  return (
    <div id="home-outer">
      <div id="left">
        <h2 id="ll">Chat Room</h2>
        <button id="add" onClick={()=>setAdd(!add)}>➕ Add Friends</button>
        {add && (
          <div id="addopen">
            <input type="text" placeholder="Search users..." value={search} onChange={handleSearch} id="search" />
            <ul id="found">
              {filteredUsers.length>0?(
                filteredUsers.map((user)=>(
                  <li key={user.id} onClick={()=>sendFriendRequest(user.username)} style={{cursor:'pointer'}}>
                    {user.username}
                  </li>
                ))
              ):(
                <li>No users found</li>
              )}
            </ul>
          </div>
        )}
        <button id="req" onClick={()=>{setSeen(!seen);if(!seen) handleReq();}}>📥Requests</button>
        {seen && (
          <div id='reqopen'>
            {requests.length===0?(
              <p id='noone'>No pending friend requests.</p>
            ):(
              <ul>
                {requests.map((req)=>(
                  <li key={req.id} id='allone'>
                    {req.sender} sent you a friend request  
                    <button onClick={()=>handleRequestAction(req.sender, "accept")}>✅ Accept</button>
                    <button onClick={()=>handleRequestAction(req.sender, "reject")}>❌ Reject</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      {acceptedFriends.length>0?(
      <div id="friends">
        {acceptedFriends.map((friend,index)=>(
          <div key={index} className="friend-wrapper" onClick={()=>handleOpenChat(friend)} >
            <div className="friend">
              <img src={'https://cdn-icons-gif.flaticon.com/18986/18986440.gif'} style={{ width: '40px', height: '40px', borderRadius: '50%', marginLeft: '170px',cursor:'pointer',marginTop:'-8px',borderColor:"blue",objectFit:'contain',position:'fixed' }} onClick={(e) =>navigate(`/read/${friend}`)}/>
              {friend}
            </div>
          </div>
        ))}
      </div>
        ):(
        <p>No accepted friends found.</p>
      )}
      </div>
      <div id="right-1">
        <div id='rightnav'>
          <img src={'https://cdn-icons-gif.flaticon.com/18986/18986440.gif'} style={{ width: '45px', height: '45px', borderRadius: '50%', marginLeft: '10px',cursor:'pointer',marginTop:'6px',borderColor:"blue",objectFit:'contain' }} onClick={() => navigate("/profile/")}/>
          <div className="Ai" onClick={() => navigate("/ai")}><img src='https://cdn-icons-gif.flaticon.com/10971/10971779.gif' id='anime'></img></div>
          {isTyping ? <p style={{ color: "black",fontSize:'30px',marginTop:'-35px',marginLeft:'200px' }}>User is typing...</p> : <p style={{ color: "black",fontSize:'30px',marginTop:'-35px',marginLeft:'200px'}}>Waiting for user...</p>}
          <button id='user'>{username}</button>
          <button id="three-dots" onClick={()=>setIsVisible(!isVisible)}>
            <img src="https://cdn-icons-png.flaticon.com/128/5461/5461290.png" id="three-pic" alt="Menu" />
          </button>
        </div>
        {isVisible && (
          <div id="right-2">
            <Settings setIsGenOpen={setIsGenOpen} />
          </div>
        )}
        {chatRoom && (<iframe id='webs' src="http://localhost:5173/#/chat"></iframe>)}
      </div>
    </div>
  );
}
export default Home;
