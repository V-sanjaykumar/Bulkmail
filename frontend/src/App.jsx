import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios'
import * as XLSX from "xlsx"

function App() {
  

  const[msg,setmsg]=useState("")
  const[Status,setstatus]=useState(false)
  const[emailsList,setemailList]=useState([])
    function handlemsg(evt)
    {
      setmsg(evt.target.value)
    }

    function handelefile(event)
    {
      const file=event.target.files[0]
    console.log(file)
    

    const reader=new FileReader()
    
    reader.onload=function(event){
        const data=event.target.result
        const workbook =XLSX.read(data,{type:"binary"})
        const sheetName=workbook.SheetNames[0]
        const worksheet=workbook.Sheets[sheetName]
        const emailList =XLSX.utils.sheet_to_json(worksheet,{header:"A"})
        const totalemail= emailList.map(function(item){return item.A})
        console.log(totalemail)
        setemailList(totalemail)
        
    }

        reader.readAsBinaryString(file)
    }

    function send(){
      setstatus(true)
      axios.post("https://bulkmail-orcin-delta.vercel.app/sendemail",{msg:msg,emailsList:emailsList})
      .then(function(data){
        if(data.data==true)
        {
          alert("email sent successfully")
          setstatus(false)
        }
        else{
          alert("failed")
        }
      })
      
    }
  return (
    <div>
      <div className='bg-black text-white text-center'>
        <h1 className='text-2xl font-bold py-5 '>BulkMail</h1>
        </div>

      <div className='bg-blue-950 text-white text-center'>
        <h1 className='text-xl font-medium py-3'>we can help you sending with multiple emails at once</h1>
        </div>

       <div className='bg-cyan-700 text-white text-center'>
        <h1 className='text-xl font-medium py-3'>Drag and Drop </h1>
        </div>
    
    <div className='bg-gray-900 flex flex-col items-center outline-black text-black px-5 py-3'>
      <textarea  value={msg} className='w-[80%] h-32 py-2 outline-none border border-black rounded-md' placeholder='enter the email text' onChange={handlemsg}></textarea>
      
      <div>
      <input onChange={handelefile} type="file" className='border-4 border-dotted py-4 px-4 mt-5 mb-5  text-white'></input>
      
    </div>
      <p className='text-white mb-2'>Total emails in the file :{emailsList.length}</p>
      <button  className='bg-blue-950 py-2 px-2 text-white font-medium rounded-md w-fit mt-2'onClick={send}>{Status?"Sending...":"send"}</button>
    </div>
    <div className='bg-blue-400 text-white text-center p-5'></div>

    <div className='bg-black text-white text-center p-6'></div>
    
    
    </div>




  )
     }

export default App
