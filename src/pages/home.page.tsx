import { useEffect, useState } from "react";
import { AdsTable } from "../components/ads-table.component";
import { MovieTable } from "../components/movies-table.component";
import { WeeklyWatchTime } from "../components/weekly-watch-time.component";
import { Badge } from "../components/badge.component";
import { faCoffee, faUser } from "@fortawesome/free-solid-svg-icons";
import { format_time } from "../utils/time.utils";

export function HomePage(){

    return <>
        <div className="flex justify-center gap-5 w-full  ">
            <GeneralBadges/> 
            <WeeklyWatchTime/> 
        </div>
        <AdsTable/> 
        <MovieTable/>
    </>
}


function GeneralBadges(){

  const [total_users,set_total_users] = useState(0);

  const [total_watch_time_today,set_total_watch_time_today] = useState('0');

  async function get_total_users(){
    const res = await fetch("http://localhost:8080/api/stats/users/general");
    const data = await res.json();
    set_total_users(data.total_users);
  }


  async function get_total_watch_time_today(){

    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    const res = await fetch("http://localhost:8080/api/stats/movies/watched",{
      method:"POST",
      body:JSON.stringify({start:start.getTime(),end:end.getTime()}),
      headers:{
        "Content-Type":"application/json"
      }
    });

    const data = await res.json();

    set_total_watch_time_today(format_time(data.total_watch_time));
  }

  


  useEffect(()=>{

    get_total_users();
    get_total_watch_time_today()
    
  },[])



  return <>
    <div className="w-1/3 flex gap-5 flex-col">
      <Badge iconClassName="shadow-[7px_7px_5px_0px_#edf2f7]" className="w-full bg-white border-solid border-2 border-neutral-100" icon={faUser} title="Total Users" value={total_users}/>
      <Badge iconClassName="shadow-[7px_7px_5px_0px_#e6bb12]" className="bg-yellow-400" icon={faCoffee} title="Today's Watch Time" value={total_watch_time_today || 0} />
    </div>
  </>
}