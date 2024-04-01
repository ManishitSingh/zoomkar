import { cn } from "@/lib/utils";
import {
  CallControls,
  CallParticipantsList,
  CallStats,
  CallStatsButton,
  CallingState,
  PaginatedGridLayout,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutList, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import EndCallButton from "./EndCallButton";
import Loader from "./Loader";

type CallLayout = "speaker-left" | "speaker-right" | "grid";

const MeetingRoom = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isPersonalRoom = !!searchParams.get("personal");
    // console.log('isPersonalRoom',isPersonalRoom);
    const {useCallCallingState}=useCallStateHooks();
    const callingState = useCallCallingState();
  const [layout, setLayout] = useState<CallLayout>("speaker-left");
  const [isParticipantsBarOpen, setIsParticipantsBarOpen] = useState(false);
  if(callingState !== CallingState.JOINED) return <Loader />;      
  const CallLayout = () => {
    switch (layout) {
      case "speaker-right":
        return <SpeakerLayout participantsBarPosition={"right"} />;
      case "grid":
        return <PaginatedGridLayout />;
      default:
        "speaker-left";
        return <SpeakerLayout participantsBarPosition={"left"} />;
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden pt-4 text-white">
      <div className="relative flex size-full items-center justify-center">
        <div className="flex size-full max-w-[1000px] items-center">
          <CallLayout />
        </div>
        <div
          className={cn(`h-[calc(100vh-86px)] hidden ml-2`, {
            "show-block": isParticipantsBarOpen,
          })}
        >
          <CallParticipantsList
            onClose={() => {
              setIsParticipantsBarOpen(false);
            }}
          />
        </div>
      </div>
      <div className=" fixed bottom-0 flex w-full justify-center items-center gap-5 flex-wrap">
        <CallControls onLeave={()=>{
            // router.push('/');
        }} />
        <DropdownMenu>
          <div className="flex items-center">
            <DropdownMenuTrigger className="cursor-pointer px-4 py-2 rounded-2xl bg-[#19232d] hover:bg-[#4c535b] ">
                <LayoutList size={20}
                 className="text-white" />
            </DropdownMenuTrigger>
          </div>
          <DropdownMenuContent className=" border-dark-1 bg-dark-1 text-white">
            <DropdownMenuItem className="cursor-pointer hover:bg-[#4c535b] " onClick={()=>{
                setLayout("grid");
            }} >Grid</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-[#4c535b] " onClick={()=>{
                setLayout("speaker-left");
            }} >Speaker-Left</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer hover:bg-[#4c535b] " onClick={()=>{
                setLayout("speaker-right");
            }} >Speaker-Right</DropdownMenuItem>

            <DropdownMenuSeparator />
          </DropdownMenuContent>
        </DropdownMenu>
        <CallStatsButton/>
        <button className="cursor-pointer px-4 py-2 rounded-2xl bg-[#19232d] hover:bg-[#4c535b]" onClick={()=>{
            setIsParticipantsBarOpen((prev)=>!prev);
        }}>
            <Users size={20} className="text-white"/>
        </button>
        {!isPersonalRoom && <EndCallButton />}
      </div>
    </section>
  );
};

export default MeetingRoom;
