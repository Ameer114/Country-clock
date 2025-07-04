import { useState, useEffect, useRef } from 'react'
import { GrAdd } from "react-icons/gr";
import Clock from './component/Clock';
import Typewriter from 'typewriter-effect';
import image from "./assets/image.png"
import Footer from './component/Footer';
function App() {
  const [name,setname]=useState("")
  const [cname,setcname]=useState("")
  const [msg,setmsg]=useState(false)
  const [countrylist,setcountry]=useState([]);
  const latlng=useRef([])
 



  useEffect(()=>{
    let n=localStorage.getItem("name")
    let li=localStorage.getItem("clist")
    if(li)
      try {
          setcountry(JSON.parse(li))
      } catch (error) {
        console.log(error);
        
      }
    
    if(n){
        setname(n)
    }
    else{
      n=prompt("Your Name Please: ")
      if (n){
        setname(n)
        localStorage.setItem("name",n)
      }
    
    } 
  },[])

  useEffect(()=>{
      if (!cname) return;
      async function getdata() {
        try {
           
           let loglat= await fetch(`https://restcountries.com/v3.1/name/${cname}`)
           loglat=await loglat.json();
          if(loglat[0]?.latlng){
            latlng.current=loglat[0].latlng;
            let data=latlng.current;
            const newEntry = { name: cname, data};
            const updatedli=[...countrylist,newEntry];
            setcountry(updatedli);
            localStorage.setItem("clist",JSON.stringify(updatedli));
            setmsg(true);
            setTimeout(() => {
            setmsg(false);       
            }, 2000); // visible for 3 seconds
          }
          else
            alert("Country not found! ")
        } catch (error) {
            console.error(error);
        }
      }
      getdata();    
  },[cname])

  const handlecountry=()=>{
  let n=prompt("Enter Country Name : ")
  if (countrylist.some(item => item.name.toLowerCase() === n.toLowerCase())) {
    alert("Country already exist !");
  } 
  else 
  setcname(n)
  }

  const del = (i) => {
  const updated = countrylist.filter((_, index) => i !== index);
  setcountry(updated);
  localStorage.setItem("clist", JSON.stringify(updated)); 
}



  return (
 <>
 
 <div className='parent'>
<h1 className='title'>Country Clock</h1>
<div className='greet'>Hey &nbsp; <span className='name'> { name.toUpperCase()}</span> , &nbsp;
<Typewriter
  options={{
    strings: ["How's Going on...", "Hope you're smashing your goals :)",
      "Keep building. Keep growing."],
    autoStart: true,
    loop: true,
     delay: 30,
     pauseFor: 1400,
     deleteSpeed: 30,
  }}
/> </div>
<div className="container">
  <div className="add card" onClick={handlecountry}>
 <img className='addimg'  src={image} alt="" />
 <br />
 <p>Add Country</p>

</div>
    {countrylist.map((item,i)=>(
      
      <Clock key={i} 
      name={item.name} 
      lat={item.data[0]} 
      lng={item.data[1]}
      handleDelete={() => del(i)}
       />
      
    ))}
 
</div>
 </div>

 { msg && <div className="msg">
  Clock has been Added!
 </div>}
<Footer/>
 </>
  )
}

export default App
