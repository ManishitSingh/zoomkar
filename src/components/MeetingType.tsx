"use client";
import Image from "next/image";
import MeetingModal from "./MeetingModal";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useToast } from "./ui/use-toast";
import { Textarea } from "./ui/textarea";
import ReactDatePicker from "react-datepicker";

const MeetingType = () => {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const client = useStreamVideoClient();
  const [callDetails, setCallDetails] = useState<Call>();
  const [values, setValues] = useState({
    dateTime: new Date(),
    description: "",
    link: "",
  });

  const [metingState, setMetingState] = useState();
  const [meetingState, setMeetingState] = useState<
    "isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
  >(undefined);

  const createMeeting = async () => {
    if (!user || !client) return;
    try {
      if (!values.dateTime) {
        toast({
          title: "Please select a date and time",
        });
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call("default", id);
      if (!call) throw new Error("Failed to create call");

      const startsAt =
        values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || "Instant Meeting";
      // console.log("v1", values.description);

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      });
      setCallDetails(call);
      console.log("call created from meeting type", call);
      if (!values.description) {
        // console.log("v2", values.description);
        router.push(`/meeting/${call.id}`);
      }
      toast({
        title: "Meeting created successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to create meeting",
      });
    }
  };
  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;
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
          router.push("/recordings");
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
      <div
        className="bg-yellow-1 px-4 py-6 flex flex-col w-full xl:max-w-[270px] min-h-[260px] rounded-[14px] cursor-pointer justify-between "
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
          <h1 className="text-2xl font-bold">Schedule Meeting</h1>
          <h4 className="text-lg font-normal">Plan your meeting</h4>
        </div>
      </div>
      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Create meeting"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5 ">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Add a description
            </label>
            <Textarea
              className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0 "
              onChange={(e) => {
                setValues((prev) => ({ ...prev, description: e.target.value }));
              }}
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-2">
              Select Date and Time
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) =>
                setValues((prev) => ({ ...prev, dateTime: date! }))
              }
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded p-2 bg-dark-3 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === "isScheduleMeeting"}
          onClose={() => setMeetingState(undefined)}
          title="Meeting Created"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast({ title: "Meeting link copied to clipboard" });
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Copy Link"
        />
      )}

      <MeetingModal
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an instant meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
      <MeetingModal
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Type the meeting link"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={() => {
          router.push(values.link);
        }}
      >
        <input
          type="text"
          placeholder="Meeting Link"
          className="w-full rounded p-2 bg-dark-3 focus:outline-none"
          onChange={(e) => {
            setValues((prev) => ({ ...prev, link: e.target.value }));
          }}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingType;
