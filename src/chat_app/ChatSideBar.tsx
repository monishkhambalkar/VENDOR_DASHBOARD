import React from "react";
import { FaMicrophone, FaFire } from "react-icons/fa";
import { BsThreeDots } from "react-icons/bs";

interface Chat {
  name: string;
  message: string;
  time: string;
  avatar: string;
  status?: "typing" | "voice";
  unread?: number;
}

const chats: Chat[] = [
  {
    name: "Roberta Casas",
    message: "Typing...",
    time: "18:05",
    avatar: "https://i.pravatar.cc/40?img=1",
    status: "typing",
  },
  {
    name: "Leslie Livingston",
    message: "Yes, we can do this! ",
    time: "14:23",
    avatar: "https://i.pravatar.cc/40?img=2",
  },
  {
    name: "Neil Sims",
    message: "Voice message",
    time: "10:02",
    avatar: "https://i.pravatar.cc/40?img=3",
    status: "voice",
    unread: 4,
  },
  {
    name: "Michael Gough",
    message: "Nevermind, I will grab the ite...",
    time: "07:45",
    avatar: "https://i.pravatar.cc/40?img=4",
  },
  {
    name: "Bonnie Green",
    message: "📷 Sent a photo",
    time: "15h",
    avatar: "https://i.pravatar.cc/40?img=5",
  },
  {
    name: "Lana Byrd",
    message: "🎉 Awesome, let’s go!",
    time: "16h",
    avatar: "https://i.pravatar.cc/40?img=6",
  },
  {
    name: "Helene Engels",
    message: "Yes, we can do this! ",
    time: "18h",
    avatar: "https://i.pravatar.cc/40?img=7",
  },
  {
    name: "Karen Nelson",
    message: "Are we still up for that coffee...",
    time: "Yesterday",
    avatar: "https://i.pravatar.cc/40?img=8",
    unread: 2,
  },
  {
    name: "Thomas Lean",
    message: "Voice message",
    time: "2d",
    avatar: "https://i.pravatar.cc/40?img=9",
    status: "voice",
  },
  {
    name: "Robert Brown",
    message: "Long time no talk, what’s up...",
    time: "1w",
    avatar: "https://i.pravatar.cc/40?img=10",
  },
];

const ChatSidebar = () => {
  return (
    <div className="w-80 h-screen bg-gray-100 p-4 shadow-lg">
      <div className="flex justify-between items-center pb-4 border-b">
        <h2 className="text-lg font-semibold">Latest chats</h2>
        <BsThreeDots className="text-gray-500 cursor-pointer" />
      </div>
      <input
        type="text"
        placeholder="Search for messages or contacts"
        className="w-full p-2 my-3 border rounded-md text-sm"
      />
      <div className="space-y-4 overflow-y-auto h-[calc(100vh-120px)]">
        {chats.map((chat, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-200 cursor-pointer"
          >
            <img
              src={chat.avatar}
              alt={chat.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">{chat.name}</h4>
                <span className="text-xs text-gray-500">{chat.time}</span>
              </div>
              <p className="text-sm text-gray-600 truncate flex items-center">
                {chat.status === "voice" && (
                  <FaMicrophone className="mr-1 text-blue-500" />
                )}{" "}
                {chat.message}
                {chat.name.includes("Helene") && (
                  <FaFire className="text-red-500 ml-1" />
                )}
              </p>
            </div>
            {chat.unread && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {chat.unread}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
