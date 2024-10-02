import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface BadgeData{
  value:number | string;
  title:string;
  icon:IconDefinition;
  className?:string;
  iconClassName?:string;
}

export function Badge({title,className,icon,iconClassName,value}:BadgeData){



  return  <> 
  
    <div className={`rounded-xl p-5 justify-between items-center flex  ${className}`}>
      <div className="w-2/3">
        <h3 className="italic mb-5 ">{title}</h3>
        <p className="text-4xl w-full break-words max">{value}</p>
      </div>
      <div className={`bg-white text-4xl text-black w-20 h-20 flex justify-center items-center rounded-full ${iconClassName}`}>
        <FontAwesomeIcon icon={icon}/>
      </div>
    </div>

  </>

}