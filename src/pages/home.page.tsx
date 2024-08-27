import { Modal, Input} from 'antd';
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
    	<TrainName/>
      <Badge iconClassName="shadow-[7px_7px_5px_0px_#edf2f7]" className="w-full bg-white border-solid border-2 border-neutral-100" icon={faUser} title="Total Users" value={total_users}/>
      <Badge iconClassName="shadow-[7px_7px_5px_0px_#e6bb12]" className="bg-yellow-400" icon={faCoffee} title="Today's Watch Time" value={total_watch_time_today || 0} />
    </div>
  </>
}


function TrainName(){

	const [train,set_train] = useState({
		id:null,
		name:""
	});  

	const [show_modal,set_show_modal] = useState(false);

	const [error_msg,set_error_msg] = useState("");

	async function get_train(){
		const res = await fetch("http://localhost:8080/api/train/");

		if(res.status == 200){
			const data = await res.json();
			set_train(data);
		}
		else {
			set_show_modal(true)
		}
	}

	async function update_train_name(){
		
		console.log(train.name)

		const res = await fetch("http://localhost:8080/api/train/up",{
			method:"POST",
			body:JSON.stringify({name:train.name}),
			headers:{
				"Content-Type":"application/json"
			}
		});
		const data = await res.json();

		set_train(data);
		if(data.error && data.status === 404){
			set_error_msg(data.error);
		}else{
			set_show_modal(false);
		}

	}

	function on_ok(){
		if(!train.name){
			set_error_msg("Name is required");
			return;
		}

		update_train_name();
	}

	function close(){
		set_show_modal(false);
	}
	
	useEffect(()=>{
		get_train();
	},[])	

	return <>
		{/* <Modal open={show_modal} onOk={on_ok} onClose={close} onCancel={close}>
			<div className="mt-5">
				<h3 className="mb-5 ml-5 font-bold italic">This Train doesn't have a name</h3>


				<label htmlFor="company_name">
					<p className="mb-3">Train Name</p>
				</label>
				<Input
					id="company_name" value={train.name} 
					onChange={(e)=>{
						set_error_msg("");
						set_train({...train,name:e.target.value})
					}}
					type="text" placeholder="Name..." className="p-3"
				/>
				{error_msg && <p className="py-2 text-red-500">{error_msg}</p>}
			</div>
		</Modal> */}

		<Badge iconClassName="shadow-[7px_7px_5px_0px_#edf2f7]" 
		className="w-full bg-white border-solid border-2 border-neutral-100"
		icon={faCoffee} title="Train Name" value={train.name} />
	</>

}
