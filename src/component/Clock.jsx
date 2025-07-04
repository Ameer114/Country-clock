import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { GrTrash } from "react-icons/gr";
import { FaRegClock } from "react-icons/fa6";


const Clock = ({name, lat, lng, handleDelete}) => {
     const [dt,setdt]=useState([]);
     const [loading, setLoading] = useState(false);

    useEffect(()=>{
         async function getdata() {
            setLoading(true);
            try {
                let res= await fetch(`https://timeapi.io/api/time/current/coordinate?latitude=${lat}&longitude=${lng}`);
                    res= await res.json();
                if(res)
                    setdt([res.date,res.time])
            } catch (error) {
                console.log(error);
            }
            finally{
                setLoading(false);
            }
        }
        getdata();

        let interval = setInterval(() => {
            getdata();
            }, 60000); 

 
        return () => clearInterval(interval);
    },[lat,lng])

    function convertTo12HourFormat(time24) {
  // Split the time string into hours and minutes
  let [hours, minutes] = time24.split(":").map(Number);

  let period = "AM"; // Default to AM

  // Determine AM/PM period and adjust hours
  if (hours >= 12) {
    period = "PM";
    if (hours > 12) {
      hours -= 12; // Subtract 12 for PM hours (e.g., 13 becomes 1)
    }
  } else if (hours === 0) {
    hours = 12; // 00:xx (midnight) becomes 12:xx AM
  }

  // Add leading zero to minutes if necessary
  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  // Return the formatted 12-hour time string
  return `${hours}:${minutes} ${period}`;
}


    

  return (
    <div className='card'>
        {loading ?
         <div className="loader"></div> :
         <div className="clock">
            <p><svg fill='white' className='svg' version="1.1"  width="24" height="24" viewBox="0 0 24 24">
                    <path d="M12 20C16.4 20 20 16.4 20 12S16.4 4 12 4 4 7.6 4 12 7.6 20 12 20M12 2C17.5 2 22 6.5 22 12S17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.5 6.5 2 12 2M15.3 16.2L14 17L11 11.8V7H12.5V11.4L15.3 16.2Z"></path>
                </svg> <span className='countryname'>{name.toUpperCase()}</span>  </p>
            
            <div className="time">{dt[1]?convertTo12HourFormat(dt[1]):""}</div>
            <div className="date">{dt[0]}</div>
           </div>
        }
          <button onClick={handleDelete} className='del' > Delete <GrTrash /> </button>
    </div>
  )
}

export default Clock
