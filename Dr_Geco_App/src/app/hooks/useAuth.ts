import axios from 'axios';
import React from 'react';
import { useState,useEffect } from 'react';


const useAuth = ()=>{
    const [error,setError]=useState('')
    const [isLogged,setIsLogged]=useState(false)
    const [isLoading,setIsLoading]=useState(false)

    useEffect(()=>{
        setIsLoading(true)
        axios.get('/api/user').then(({ data }) => {
            if (data.error) {
                setError('Your Are Not Authorized')
            }
            else{
                setIsLogged(true)
                setIsLoading(false)
            }
        }).catch(err=>setError(err))
    },[])

    return {isLogged,error,isLoading}
}

export default useAuth