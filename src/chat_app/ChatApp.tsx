import React from "react";
import ChatSidebar from "./ChatSideBar";
import ChatMainContainer from "./ChatMainContainer";

type Message = {
  id: number;
  sender: string;
  text: string;
  time: string;
  type?: "text" | "voice";
};

const messages: Message[] = [
  {
    id: 1,
    sender: "Roberta Casas",
    text: "That's awesome. I think our users will really appreciate the improvements.",
    time: "11:46",
  },
  { id: 2, sender: "Roberta Casas", text: "", time: "11:48", type: "voice" },
  {
    id: 3,
    sender: "Joseph McFall",
    text: "I agree on this one and we should add it to the next sprint so that we can roll it out as soon as possible.",
    time: "11:48",
  },
  {
    id: 4,
    sender: "Joseph McFall",
    text: "Hey Roberta... forgot to ask, but can you please send me a pic of the new office?",
    time: "11:48",
  },
  {
    id: 5,
    sender: "Roberta Casas",
    text: "Here's the new office!",
    time: "11:46",
  },
];

const currentUser = {
  id: "65a123456789abcd1234efgh",
  name: "John Doe",
  email: "johndoe@example.com",
  profilePicture: "https://via.placeholder.com/150",
  status: "online",
  lastSeen: "2025-02-23T10:30:00Z",
};

const ChatUI = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <ChatSidebar />
      <ChatMainContainer user={currentUser} />
    </div>
  );
};

export default ChatUI;
