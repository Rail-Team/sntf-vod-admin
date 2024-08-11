import { Button, Input, Modal, Table, TableColumnsType } from "antd";
import { ButtonExecl, ButtonPDF } from "./button-exports.component";
import { Card } from "./card.component";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAdd, faEdit } from "@fortawesome/free-solid-svg-icons";
import { format_time } from "../utils/time.utils";
import axios from 'axios'

export interface AdWatch{
  id:string;
  company_name:string;
  title:string;
  total_views:number;
  total_watch_time:number;
}

export interface Ad{
  id:string;
  company_name:string;
  title:string;
  skip_duration:number;
}

export function AdsTable(){

  const [ads,set_ads] = useState<AdWatch[]>([]);

  async function get_ads(){
    const res = await fetch("http://localhost:8080/api/stats/ads/general");
    const data = await res.json();
    set_ads(data); 
  }

  const [ad_edit,set_ad_edit] = useState<Ad|null>(null);
 
  async function show_edit_modal(ad_id:string){
    const res = await fetch( "http://localhost:8080/api/ads/"+ad_id);
    const ad = await res.json()
    set_ad_edit(ad)
  }

  function close_edit_modal(){
    set_ad_edit(null)
  }


  const [ad_upload,set_ad_upload] = useState<Ad|null>(null);
  const [file,set_file] = useState<File | null>(null)
 
  async function show_upload_modal(){
    set_ad_upload({
      id:"",
      company_name:"",
      title:"",
      skip_duration:0
    })
  }

  function close_upload_modal(){
    set_ad_upload(null)
    set_file(null)
  }

  async function upload_ad(){

    if(file === null || ad_upload === null){
      return;
    }

    const form_data = new FormData()

    form_data.append("ad_file",file);
    form_data.append("company_name",ad_upload.company_name)
    form_data.append("title",ad_upload.title)
    form_data.append("skip_duration",String(ad_upload.skip_duration))

    const res = await fetch(`http://localhost:8080/api/ads/upload`, {
      method: "POST",
      body: form_data,
    })
    res.json()
      

      


    get_ads()
    close_upload_modal()
  }

  const ads_columns: TableColumnsType<AdWatch> = [
    {
      key: 'action',
      render:(_,record)=>{         
        return <Button onClick={()=>show_edit_modal(record.id)} className="py-7 m-0 shadow-none bg-none border-none"><FontAwesomeIcon className="text-lg" icon={faEdit} /></Button>
      },
      className:"!p-0",
      align:'center',
      width:"0"
    },
    {
      key: 'company_name',
      title: 'Company Name',
      dataIndex: 'company_name',
    },
    {
      key: 'title',
      title: 'Title',
      dataIndex: 'title',
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
      render: format_time
    },
    
  ];

  async function export_ads_pdf(){

    const file_name = "Sheet";
    const keys = ads_columns.map(e=>e.title);
    
    keys.shift();

    const values = ads.map(e=>[e.company_name,e.title,e.total_views,e.total_watch_time])

    const res = await fetch( "http://localhost:8080/api/files/pdf", {
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

  async function export_ads_excel(){

    const sheet_name = "Sheet";
    const keys = ads_columns.map(e=>e.title);
    
    keys.shift();

    const values = ads.map(e=>[e.company_name,e.title,e.total_views,e.total_watch_time])

    const res = await fetch( "http://localhost:8080/api/files/excel", {
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
    get_ads()
  },[])

  
  async function update_ad_selected(){

    await fetch( "http://localhost:8080/api/ads/update", {
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify(ad_edit)
    });

    get_ads()
    close_edit_modal()

  }

  return <>

    <Modal open={ad_edit !== null} onOk={update_ad_selected} onClose={close_edit_modal} onCancel={close_edit_modal}>
      <UpdateAd ad={ad_edit!} set_ad_edit={set_ad_edit}/>
    </Modal>

    <Modal open={ad_upload !== null} onOk={upload_ad} onClose={close_upload_modal} onCancel={close_upload_modal}>
      <UploadAd ad={ad_upload!} set_file={set_file} set_ad_upload={set_ad_upload} />
    </Modal>

    <Card title="Advertisements"  >
      <div className="mb-5 flex flex-wrap justify-end gap-3">
        <ButtonExecl onClick={export_ads_excel} />
        <ButtonPDF onClick={export_ads_pdf}/>
        <Button onClick={show_upload_modal} className="py-5 px-7 rounded-full bg-blue-400 border-blue-400 font-bold text-white">Add <FontAwesomeIcon icon={faAdd}/></Button>
      </div>
      <Table bordered columns={ads_columns} dataSource={ads} />
    </Card>

  </>

}

function UploadAd({ad,set_ad_upload,set_file}:{ad:Ad, set_ad_upload:any,set_file:any}){

  return <>
    <div className="mt-5">

      <h3 className="mb-5 ml-5 font-bold italic">Upload Ad</h3>

      <label
        htmlFor="files_upload"
      ><p className="mb-3">Files Upload</p></label>
      <Input
        id="files_upload" 
        type="file"
        onChange={(e)=>{
          set_file(e.target.files ? e.target.files[0] : null)
        }}
        className="p-3"
      />

      <label
        htmlFor="company_name"
      ><p className="mb-3">Company Name</p></label>
      <Input
        id="company_name" 
        type="text"
        value={ad.company_name}
        onChange={(e)=>{
          set_ad_upload({...ad,company_name:e.target.value})
        }}
        placeholder="Company Name..." 
        className="p-3"
      />

      <label
        htmlFor="title"
      >
        <p className="my-3">Title</p>
      </label>

      <Input
        id="title" 
        type="text"
        value={ad.title}
        onChange={(e)=>{
          set_ad_upload({...ad,title:e.target.value})
        }}
        placeholder="title..." 
        className="p-3"
      />
      
      <label
        htmlFor="ad_skip_duration"
      ><p className="my-3">Skip Duration</p></label>
      <Input
        id="ad_skip_duration" 
        type="number"
        value={ad.skip_duration}
        onChange={(e)=>{
          set_ad_upload({...ad,skip_duration:parseInt(e.target.value) || 0})
        }}
        placeholder="Set Ad skip duration..." 
        className="p-3"
      />
    </div>
  </>
}

type UpdateSelectAd = (new_ad:Ad) => void;

function UpdateAd({ad,set_ad_edit}:{ad:Ad,set_ad_edit:UpdateSelectAd}){

  return <>
    <div className="mt-5">

      <h3 className="mb-5 ml-5 font-bold italic">{ad.title}</h3>


      <label
        htmlFor="company_name"
      ><p className="mb-3">Company Name</p></label>
      <Input
        id="company_name" 
        value={ad.company_name} 
        onChange={(e)=>{
          set_ad_edit({...ad,company_name:e.target.value})
        }}
        type="text"
        placeholder="Company Name..." 
        className="p-3"
      />

      <label
        htmlFor="title"
      >
        <p className="my-3">Title</p>
      </label>

      <Input
        id="title" 
        value={ad.title} 
        onChange={(e)=>{
          set_ad_edit({...ad,title:e.target.value})
        }}
        type="text"
        placeholder="title..." 
        className="p-3"
      />
      
      <label
        htmlFor="ad_skip_duration"
      ><p className="my-3">Skip Duration</p></label>
      <Input
        id="ad_skip_duration" 
        value={ad.skip_duration} 
        onChange={(e)=>{
          set_ad_edit({...ad,skip_duration:parseInt(e.target.value) || 0})
        }}
        type="number"
        placeholder="Set Ad skip duration..." 
        className="p-3"
      />
    </div>
  </>
}