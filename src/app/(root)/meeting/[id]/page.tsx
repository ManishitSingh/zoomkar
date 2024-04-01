"use client";
import MeetingRoom from "@/components/MeetingRoom";
import MeetingSetup from "@/components/MeetingSetup";
import { useUser } from "@clerk/nextjs";
import { StreamCall, StreamTheme } from "@stream-io/video-react-sdk";
import React, { use, useState } from "react";
import { useGetCallById } from "../../../../../hooks/useGetCallById";
import Loader from "@/components/Loader";

const Meeting = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { user, isLoaded } = useUser();
  console.log('user',user);
  console.log('isLoaded',isLoaded);
  const [isSetup, setIsSetup] = useState(false);
  console.log('isSetup',isSetup);
  
  const { call, isCallLoading } = useGetCallById(id);
  if(!isLoaded || isCallLoading) return <Loader />
  console.log('callfrom page meeting page',call);//
  return (
    <main className="h-screen w-screen">
      <StreamCall call={call}>
        <StreamTheme>{isSetup ? <MeetingRoom /> : <MeetingSetup setIsSetup={setIsSetup} />}</StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
