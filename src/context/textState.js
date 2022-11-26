import React, { useRef } from 'react'
import TextContext from './textContext'
import { useState } from 'react'
import { CSVLink } from 'react-csv'

const TextState=(props)=>{
  const customers=[];
  const host="http://localhost:8000";
    
  const[students,setentries]=useState(customers);
  

  const getstudents=async()=>{
    const response=await fetch(`${host}/api/create/getallstudents`,{
        method:'GET',
        headers:{
            'Content-Type':'application/json'
        }
    });
    const json=await response.json();
    
    setentries(json);
}
const [alert, setalert] = useState(null);
  const showalert=(message,type)=>{
    setalert({
      msg:message,
      type:type
    })
    setTimeout(()=>{
      setalert(null);
    },3000)

  }
        
    return (
        
        <TextContext.Provider value={{students,getstudents,alert,showalert}}>
            {props.children}
        </TextContext.Provider>
    )
}
export default TextState;