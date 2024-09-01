import { Table, TableColumnsType } from "antd";
import { ButtonExecl, ButtonPDF } from "./button-exports.component";
import { Card } from "./card.component";
import { useEffect, useState } from "react";
import { format_time } from "../utils/time.utils";

export interface Movie{
  movie_id:string;
  name:string;
  total_views:number;
  total_watch_time:number;
}

export function MovieTable(){

    const movies_columns: TableColumnsType<Movie> = [
        {
            key: 'name',
            title: 'Title',
            dataIndex: 'name',
        },
        {
            key: 'total_views',
            title: 'Total Views',
            dataIndex: 'total_views',
        },
        {  
            key: 'total_watch_time',
            title: 'Total Watch Time',
            dataIndex: 'total_watch_time',
            render:format_time
        },
    ];

    const [movies,set_movies] = useState<Movie[]>([]);

    async function get_movies(){
    const res = await fetch("http://192.168.10.8/api/stats/movies/general");
    const data = await res.json();
    set_movies(data); 
    }

    async function export_movies_pdf(){

    const file_name = "Sheet";
    const keys = movies_columns.map(e=>e.title);

    const values = movies.map(e=>[e.name,e.total_views,e.total_watch_time])

    const res = await fetch( "http://192.168.10.8/api/files/pdf", {
        method:"POST",
        headers:{
        "Content-Type":"application/json"
        },
        body:JSON.stringify({file_name,keys,values})
    });

    const blob = await res.blob();

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'Sheet.pdf';
    document.body.appendChild(link);
    link.click(); 
    document.body.removeChild(link)

    }

    async function export_movies_excel(){

        const sheet_name = "Sheet";
        const keys = movies_columns.map(e=>e.title);

        const values = movies.map(e=>[e.name,e.total_views,e.total_watch_time])

        const res = await fetch( "http://192.168.10.8/api/files/excel", {
            method:"POST",
            headers:{
            "Content-Type":"application/json"
            },
            body:JSON.stringify({sheet_name,keys,values})
        });

        const blob = await res.blob();
        const b = new Blob([blob],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});


        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(b);
        link.download = 'Sheet.xlsx';
        document.body.appendChild(link);
        link.click(); 
        document.body.removeChild(link)
    }


    useEffect(()=>{
        get_movies();
    },[])
    
    return <>
        <Card title="Movies"  >
            <div className="mb-5 flex flex-wrap justify-end gap-3">
              <ButtonExecl onClick={export_movies_excel} />
              <ButtonPDF onClick={export_movies_pdf}/>
            </div>
            <Table bordered columns={movies_columns} dataSource={movies} />
        </Card>
    </>
}