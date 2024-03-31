"use client";
import Image from "next/image";
import MeetingModal from "./MeetingModal";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";

const MeetingType = () => {
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const[callDetails, setCallDetails] = useState<Call>();
  const [values, setValues] = useState({
    dateTime:new Date(),
    description:'',
    link:''
  });

  const [metingState, setMetingState] = useState();
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >(undefined);

  const createMeeting = async() => {
    if (!user || !client) return;
    try {
      const id = crypto.randomUUID();
      const call = client.call('default',id);
      if(!call) throw new Error('Failed to create call');

      const startsAt = values.dateTime.toISOString()||new Date(Date.now()).toISOString();
      const description = values.description||'Instant Meeting';
      await call.getOrCreate({
        data:{
          starts_at:startsAt,
          custom:{
            description
          }
        }
      });
      setCallDetails(call);
      if(!values.description){
        router.push(`/meeting/${call.id}`);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
      <div
        className="bg-orange-1 px-4 py-6 flex flex-col w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer justify-between "
        onClick={() => {
          setMeetingState("isInstantMeeting");
        }}
      >
        <div className="flex-center glassmorphism size-12 rounded-[12px] ">
          <Image
            src="/icons/add-meeting.svg"
            alt="meeting"
            width={27}
            height={27}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">New Meeting</h1>
          <h4 className="text-lg font-normal">Start an instant meeting</h4>
        </div>
      </div>

      <div
        className="bg-blue-1 px-4 py-6 flex flex-col w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer justify-between "
        onClick={() => {
          setMeetingState("isJoiningMeeting");
        }}
      >
        <div className="flex-center glassmorphism size-12 rounded-[12px] ">
          <Image
            src="/icons/add-meeting.svg"
            alt="meeting"
            width={27}
            height={27}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Join Meeting</h1>
          <h4 className="text-lg font-normal">via invitation link</h4>
        </div>
      </div>
      <div
        className="bg-purple-1 px-4 py-6 flex flex-col w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer justify-between"
        onClick={() => {
          setMeetingState("isScheduleMeeting");
        }}
      >
        <div className="flex-center glassmorphism size-12 rounded-[12px] ">
          <Image
            src="/icons/add-meeting.svg"
            alt="meeting"
            width={27}
            height={27}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">View Recordings</h1>
          <h4 className="text-lg font-normal">Check out your recordings</h4>
        </div>
      </div>
      <div className="bg-yellow-1 px-4 py-6 flex flex-col w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer justify-between ">
        <div className="flex-center glassmorphism size-12 rounded-[12px] ">
          <Image
            src="/icons/add-meeting.svg"
            alt="meeting"
            width={27}
            height={27}
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Schedule Meeting</h1>
          <h4 className="text-lg font-normal">Plan your meeting</h4>
        </div>
      </div>
      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an instant meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
    </section>
  );
};

export default MeetingType;
