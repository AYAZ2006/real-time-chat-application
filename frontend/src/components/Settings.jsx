import React,{useState,useContext,useEffect} from 'react'
import {Switch,Button} from 'antd'
import {useTranslation} from 'react-i18next'
import {useNavigate} from 'react-router-dom'
function Settings() {
  const[section,setSection]=useState(null)
  const[ison,setIson]=useState(false)
  const{t,i18n}=useTranslation()
  const[selectedLang,setSelectedLang]=useState(i18n.language || 'english')
  const[theme,setTheme]=useState(localStorage.getItem('theme')||'light')
  const username=localStorage.getItem('username')
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "https://loopchat.vercel.app/#/login";
};
  const handleSelectChange=(event)=>{
    setSelectedLang(event.target.value)
  }
  const saveLanguageChange=()=>{
    i18n.changeLanguage(selectedLang)
    alert(t('settings_updated'))
  }
  const toggleSection=(section)=>{
    setSection((prev)=>(prev===section?null:section))
  }
  const toggleTheme=()=>{
    const newTheme=(theme==='light'?'dark':'light')
    setTheme(newTheme)
    localStorage.setItem('theme',newTheme)
    if(newTheme==='dark'){
      document.body.style.backgroundColor='#343541'
      document.body.style.color='#ECECF1'
    }
    else{
      document.body.style.backgroundColor='#ffffff'
      document.body.style.color='#202123'
    }
  }
  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete your account? This action cannot be rollback.")
    if (!confirmDelete) return
    try {
        const username=localStorage.getItem('username')
        const response = await fetch("https://loopchat-backend.vercel.app/api/accounts/delete/${username}/", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data = await response.json()
        if (response.ok) {
            alert("Account deleted successfully!")
            navigate('/')
        } else {
            alert(`Error: ${data.error || "Failed to delete account."}`)
        }
    } catch (error) {
        console.error("Error deleting account:", error)
        alert("Something went wrong. Please try again.")
      }
  }
  return (
    <div id="set">
      <div id="open">
        <h3 id="stop">{t('settings')}</h3>
            <select id="langs" value={selectedLang} onChange={handleSelectChange}>
              <option value="hindi">हिन्दी</option>
              <option value="english">English</option>
              <option value="telugu">తెలుగు</option>
              <option value="arabic">العربية</option>
            </select>
            <div id="auto">
              <h5 id="autot">{t('auto_text_corrector')}</h5>
              <Switch id='autob' onClick={()=>setIson(!ison)}/>
            </div>
            <Button id="save" type="primary" onClick={saveLanguageChange}>{t('save')}</Button>
            <div id='theme'>
              <h5 id='themet'>Dark Mode</h5>
              <Switch checked={theme==='dark'} onChange={toggleTheme} id='themeb'></Switch>
            </div>
            <button onClick={handleLogout} id='logout'>Logout🚪</button>
            <button onClick={handleDelete} id='delete'>Delete🗑️</button>
      </div>
    </div>
  );
}

export default Settings;
