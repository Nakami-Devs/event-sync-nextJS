import {EventItem} from "@/types";

export interface FavoriteItem {
    id:string;
    eventId:string;
    event:EventItem;
}

export async function getFavorites():Promise<FavoriteItem[]>{
    try{
        const res = await fetch(
            "http://localhost:3000/api/favorites",
            {
                cache:"no-store"
            }
        );
        if(!res.ok) {
            return [];
        }
        return res.json();
    }catch{
        return [];
    }
}

export async function addFavorite(eventId:string){
    const res = await fetch(
        "/api/favorites",
        {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                eventId
            })
        }
    );
    return res.json();
}

export async function removeFavorite(eventId:string){
    const res = await fetch(
        `/api/favorites/${eventId}`,
        {
            method:"DELETE"
        }
    );
    return res.json();
}