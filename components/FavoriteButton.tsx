import axios from "axios";
import React,{useCallback,useMemo} from 'react'

import useCurrentUser from "@/hooks/useCurrentUser";
import useFavorites from "@/hooks/useFavorites";

import {AiOutlinePlus , AiOutlineCheck} from 'react-icons/ai'


interface FavoritesButtonProps {
    movieId:string
}


const FavoritesButton:React.FC<FavoritesButtonProps> = ({movieId}) =>{
    const {mutate:mutateFavorites} = useFavorites()
    const {data:currentUser , mutate} = useCurrentUser()

    const isFavorite = useMemo(() =>{
        const list =currentUser?.favoriteIds || []

        return list.includes(movieId)
    },[currentUser,movieId])

    const toggleFavorites = useCallback(async () => {
        let response ;

        if(isFavorite){
            response = await axios.delete('/api/favorite',{data:{movieId}})
        } else {
            response = await axios.post('/api/favorite',{movieId})
        }

        const updatedFavoritesIds = response?.data?.favoriteIds

        mutate({
            ...currentUser,
            favoriteIds:updatedFavoritesIds
        }) 

        mutateFavorites()
    },[movieId,mutate,mutateFavorites,currentUser,isFavorite])


    const Icon = isFavorite ? AiOutlineCheck : AiOutlinePlus

    return (
        <div onClick={toggleFavorites} className="cursor-pointer group/item w-6 h-6 lg:w-10 lg:h-10 border-white border-2 rounded-full flex justify-center items-center transition hover:border-neutral-300">
        <Icon className="text-white group-hover/item:text-neutral-300 w-4 lg:w-6" />
    </div>
    )
}

export default FavoritesButton