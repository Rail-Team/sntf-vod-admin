import { faFilePdf, faFileCsv } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Button } from "antd"

export function ButtonPDF({onClick}:{onClick:React.MouseEventHandler<Element>}){
  return<>
    <Button onClick={onClick} className="py-5 px-7 rounded-full bg-red-400 border-red-400 hover:!border-red-400 hover:!text-red-400 font-bold text-white"><FontAwesomeIcon icon={faFilePdf}/>PDF</Button>
  </>
}

export function ButtonExecl({onClick}:{onClick:React.MouseEventHandler<Element>}){
  return <>
    <Button onClick={onClick} className="py-5 px-7 rounded-full bg-green-400 border-green-400 hover:!border-green-400 hover:!text-green-400 font-bold text-white"><FontAwesomeIcon icon={faFileCsv}/>Excel</Button>
  </>
}