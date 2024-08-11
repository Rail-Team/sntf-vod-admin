export interface CardData{
  className?:string;
  title?:string;
}

export function Card(props:React.PropsWithChildren<CardData>){

  return <div className={`mt-9 rounded-xl  bg-white p-7 shadow-[1px_1px_5px_2px_#edf2f7] ${props.className ?? ""}`}>
    <h1 className="text-lg mb-5 ">{props.title}</h1>

    {props.children}
  </div>

}