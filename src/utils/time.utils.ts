export function format_time(seconds:number){

    const hours = Math.floor(seconds / 3600);
    const h = String(hours).padStart(2,'0');
    const min = String(Math.floor((seconds % 3600) / 60)).padStart(2,'0')
    const sec = String(Math.floor(seconds % 60)).padStart(2,'0')
    return `${h}:${min}:${sec}`
}