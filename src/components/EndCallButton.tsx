"use client";

import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const EndCallButton = () => {
    const router = useRouter();
    const call = useCall();
    const {useLocalParticipant} = useCallStateHooks();
    const localParticipant = useLocalParticipant();
    const isMeetingOwner = localParticipant && call?.state.createdBy && localParticipant.userId === call.state.createdBy.id;
    if(!isMeetingOwner) return null;
    return (
    <div>
      <Button onClick={async()=>{
        await call.endCall();
        console.log('call ended');
        router.push('/');
        console.log('redirected to home');
      }} className="bg-red-500">
        End Call 
      </Button>
    </div>
  )
}

export default EndCallButton
