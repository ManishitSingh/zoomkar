"use client";
import { tokenProvider } from '@/actions/stream.action';
import { useUser } from '@clerk/nextjs';
import {
    StreamVideo,
    StreamVideoClient,
  } from '@stream-io/video-react-sdk';
import { Loader } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
  
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  

  
const StreamVideoProvider  = ({ children }:{children:ReactNode}) => {
    const[videoClient, setVideoClient] = useState<StreamVideoClient>();
    const {user,isLoaded} = useUser();
    useEffect(()=>{
        if(!isLoaded||!user){
            return;
        }
        if(!apiKey) {
            throw new Error('Stream API key not set');
        }
        const client = new StreamVideoClient({
            apiKey,
            user:{
                id:user?.id,
                name:user?.username || user?.id,
                image:user?.imageUrl,
            },
            tokenProvider:tokenProvider
        })
        setVideoClient(client);
            
    },[isLoaded,user]);
    if(!videoClient){
        return <Loader/>
    }
    return (
      <StreamVideo client={videoClient}>
            {children}
      </StreamVideo>
    );
  };

export default StreamVideoProvider;