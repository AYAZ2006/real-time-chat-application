import React, { useEffect,useState } from 'react'
import {Link, useParams } from 'react-router-dom'
function ReadOnlyProfile() {
  let {friendname}=useParams()
  const[github,setGithub]=useState('')
  const[linkedin,setLinkedin]=useState('')
  const[portfolio,setPortfolio]=useState('')
  useEffect(()=>{
    const fetchProfile=async()=>{
      try {
        const response=await fetch(`https://loopchat-backend.vercel.app/api/accounts/get-profile/${friendname}/`)
        const data=await response.json()
        if (response.ok) {
          setGithub(data.github)
          setLinkedin(data.linkedin)
          setPortfolio(data.portfolio)
        } else {
          console.error("Error:", data.error)
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
      }
    }
    fetchProfile()
  }, [friendname])
  return (
    <div id='profile'>
        <div id='prof-image'></div>
        <h3 id='friend-name'>username:{friendname}</h3>
        <h2 id='gits'>Github:</h2>
        <Link to={github} id='link-gits'>Github</Link>
        <h2 id='links'>Linked-in:</h2>
        <Link to={linkedin} id='link-links'>Linked-In</Link>
        <h2 id='ports'>Portfolio:</h2>
        <Link to={portfolio} id='link-ports'>Portfolio</Link>
    </div>
  )
}

export default ReadOnlyProfile
