"use client";
import {
  DeviceSettings,
  VideoPreview,
  useCall,
} from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

const MeetingSetup = ({setIsSetup}:{setIsSetup:(value:boolean) => void}) => {
  const [isMSetup, setIsMSetup] = useState(false);
  const call = useCall();
  console.log('call from setup',call);
  if (!call) throw new Error("Use call outside of StreamCall");

  useEffect(() => {
    if (isMSetup) {
      call?.microphone.disable();
      call?.camera.disable();
    } else {
      call?.microphone.enable();
      call?.camera.enable();
    }
  }, [call?.camera, call?.microphone, isMSetup]);

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">Setup</h1>
      <VideoPreview />
      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMSetup}
            onChange={(e) => setIsMSetup(e.target.checked)}
          />
          Join without audio and video
        </label>
        <DeviceSettings />
      </div>
      <Button className="rounded-md bg-green-500 px-4 py-2.5" onClick={()=>{
        setIsSetup(true);
        call.join();
      }}>
        Join meeting
      </Button>
    </div>
  );
};

export default MeetingSetup;
