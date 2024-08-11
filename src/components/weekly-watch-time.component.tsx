import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Card } from "./card.component";
import { ConfigProvider, DatePicker } from "antd";
import { format_time } from "../utils/time.utils";

export const dtype = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"] as const;
export type DaysType = typeof dtype[number];

export interface WeeklyWatch{
  
  day: DaysType;
  total_watch_time:number;
}

export interface WeeklyUsers{
  day: DaysType;
  users_count:number;
}

export function WeeklyWatchTime(){

    const [weekly_watch,set_weekly_watch] = useState<number[]>([]);
    const [weekly_users,set_weekly_users] = useState<number[]>([]); 

    const days_of_week = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
    const [days,set_days] = useState(days_of_week);
  
    async function get_weekly_watch(time?:number){
    
        let start;
        let end;

        if(time === undefined){
          start = Date.now() - 6 * 24 * 60 * 60 * 1000;
          end = Date.now();
        }else{
          start = time;
          end = time + 6 * 24 * 60 * 60 * 1000; 
        }

        const payload = {
          start,
          end
        }

        const [movie_watch_time_res,users_this_week_res] = await Promise.all([
          fetch( "http://localhost:8080/api/stats/movies/watched/this_week", {
              method:"POST",
              headers:{
              "Content-Type":"application/json"
              },
              body:JSON.stringify(payload)
          }),
          fetch( "http://localhost:8080/api/stats/users/this_week", {
              method:"POST",
              headers:{
              "Content-Type":"application/json"
              },
              body:JSON.stringify(payload)
          }),
        ]);

        const movie_watch_time_data:WeeklyWatch[] = await movie_watch_time_res.json();

        const users_this_week_data:WeeklyUsers[] = await users_this_week_res.json();

        const watch_days = movie_watch_time_data.map(item => item.day);

        const start_index = days_of_week.indexOf(watch_days[0]);

        const reordered_days = days_of_week.slice(start_index).concat(days_of_week.slice(0, start_index));
        
        const watch_time_data_map = new Map(movie_watch_time_data.map(item => [item.day, item.total_watch_time]));

        const watch_time_data = reordered_days.map(day => ({
            day,
            //@ts-ignore
            total_watch_time: watch_time_data_map.get(day) || 0
        }));


        set_days(reordered_days);

        set_weekly_watch(watch_time_data.map(e=>{
          const value = e.total_watch_time;
          const h = value;
          return h
        }));

        set_weekly_users(users_this_week_data.map(e=>e.users_count));

    }

    useEffect(()=>{
        get_weekly_watch();
    },[])

    return <>
        <Card title="Total Watch Time" className="w-2/3 !mt-0 ">
              <Bar
                options={{
                  plugins:{
                    tooltip:{
                      callbacks:{
                        label: function(context) {
                          console.log(context.formattedValue)
                          return [
                            "Total Watch Time: " + format_time(context.raw as number),
                            "Total Users: " + String(weekly_users[context.dataIndex])
                          ];
                        }
                      }
                    }
                  }
                }}
                data={{
                  labels:days,
                  datasets:[
                    {
                      label:"Total Watch Time",
                      data: weekly_watch,
                      backgroundColor:"#60a5fa"
                    },
                  ]
                }}
              /> 
              <div className="text-center mt-5">
                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: '#facc15',
                      borderRadius: 2,
                      colorBgContainer: '#fff',
                    },
                  }}
                >
                <DatePicker
                  onChange={e=>{
                    const date = new Date(e.toISOString());
                    const time = date.getTime();
                    get_weekly_watch(time);
                  }}
                  className="py-3 px-5 rounded-xl border-neutral-200 border-2 hover:!border-yellow-400 focus-within:!border-yellow-400 !outline-yellow-400"
                />
                </ConfigProvider>
              </div>
            </Card> 
            
    </>

}