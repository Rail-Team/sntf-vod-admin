import { faChartSimple, faRectangleAd, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsWithChildren } from "react";

export function Layout({children}:PropsWithChildren){
    
    return <>

        <div className="flex h-lvh">
            <aside className="w-1/6 border-neutral-700 border-r-2 bg-neutral-950">
            <ul>
                <li className="p-1"><a className="rounded text-white block hover:bg-neutral-900 bg-neutral-950  p-3" href="/"><FontAwesomeIcon className="mr-3" icon={faChartSimple}/> Overview</a></li>
                {/* <li className="p-1"><a className="rounded block text-white hover:bg-neutral-900 bg-neutral-950  p-3" href=""><FontAwesomeIcon className="mr-3" icon={faRectangleAd}/> Ads</a></li> */}
                {/* <li className="p-1"><a className="rounded block text-white hover:bg-neutral-900 bg-neutral-950  p-3" href=""><FontAwesomeIcon className="mr-3" icon={faPlay}/> Movies</a></li> */}
            </ul>
            </aside> 
            
            <main className="w-full h-lvh overflow-y-auto overflow-x-hidden  p-10">

                {children}
            </main>
        </div>
    </>

}