"use client";
import { tokenProvider } from "@/actions/stream.actions";
import Loader from "@/components/Loader";
import { useUser } from "@clerk/nextjs";
import { StreamVideo, StreamVideoClient } from "@stream-io/video-react-sdk";

import { ReactNode, useEffect, useState } from "react";
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();
  const { user, isLoaded } = useUser();
  console.log('userfrom provider',user);
  useEffect(() => {
    if (!isLoaded || !user) {
      console.log('isLoaded',isLoaded);
      return;
    }
    if (!apiKey) {
      throw new Error("Stream API key not set");
    }
    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user?.id,
        name: user?.username || user?.id,
        image: user?.imageUrl,
      },
       tokenProvider,
    });
    setVideoClient(client);
    console.log('client',client);
  }, [isLoaded, user]);
  if (!videoClient) {
    return <Loader />;
  }
  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
};

export default StreamVideoProvider;
