import {
  FaPhone,
  FaVideo,
  FaInfoCircle,
  FaPaperclip,
  FaMicrophone,
} from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { IoSend } from "react-icons/io5";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import axios from "axios";
// import config from "../config/config";
// import { retry } from "@reduxjs/toolkit/query";

const ChatMainContainer = ({ user }) => {
  // for message
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const socketRef = useRef<WebSocket | null>(null);

  // for emoji
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  // doc files send
  const [file, setFile] = useState<File | null>(null);

  // for audio message send
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Float32Array | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleEmojiSelect = (emojiData: EmojiClickData) => {
    setInput((prev) => prev + emojiData.emoji);
    setIsEmojiOpen(false);
  };

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const uploadedFile = event.target.files[0];
      setFile(uploadedFile);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Float32Array(bufferLength);
    analyserRef.current = analyser;
    dataArrayRef.current = dataArray;

    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
      setAudioURL(URL.createObjectURL(audioBlob));
      audioChunksRef.current = [];
    };

    mediaRecorderRef.current.start();
    setIsRecording(true);
    visualizeAudio();
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const visualizeAudio = () => {
    if (!canvasRef.current || !analyserRef.current || !dataArrayRef.current)
      return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      if (!isRecording) return;

      requestAnimationFrame(draw);
      analyserRef.current!.getFloatTimeDomainData(dataArrayRef.current!);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#6b46c1";

      const sliceWidth = canvas.width / dataArrayRef.current.length;
      let x = 0;
      for (let i = 0; i < dataArrayRef.current.length; i++) {
        const y = (1 - dataArrayRef.current[i]) * canvas.height;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.stroke();
    };

    draw();
  };

  // 🔗 WebSocket Connection
  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:5514");

    const socket = socketRef.current;
    console.log("WebSocket Instance:", socket);

    socket.addEventListener("open", () => {
      console.log("✅ Connected to WebSocket server");
    });

    socket.addEventListener("message", (event) => {
      let newMessage = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.addEventListener("error", (error) => {
      console.error("❌ WebSocket Error:", error);
    });

    socket.addEventListener("close", () => {
      console.log("🔌 Disconnected from WebSocket server");
    });

    return () => {
      if (socket) {
        socket.close();
        socketRef.current = null;
      }
    };
  }, []);

  const sendMessage = (receiverId) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      if (input.trim() !== "") {
        const messageData = {
          sender: user?.id || "0", // Ensure sender ID is a string
          senderName: user?.name || "Anonymous",
          message: input,
          type: "message",
          receiver: String(receiverId), // Ensure receiver ID is a string
        };

        console.log(messageData);

        socketRef.current.send(JSON.stringify(messageData)); // ✅ Send properly formatted JSON

        setMessages((prev) => [...prev, messageData]); // ✅ Store as an object, not a string
        setInput("");
      }
    } else {
      console.warn("⚠️ WebSocket is not connected");
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white shadow-md">
        <div className="flex items-center gap-3">
          <img
            src="https://randomuser.me/api/portraits/men/45.jpg"
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <h2 className="text-lg font-semibold">Joseph McFall</h2>
            <p className="text-sm text-green-600">Online</p>
          </div>
        </div>
        <div className="flex gap-4 text-gray-500">
          <FaPhone className="text-xl cursor-pointer hover:text-purple-600" />
          <FaVideo className="text-xl cursor-pointer hover:text-purple-600" />
          <FaInfoCircle className="text-xl cursor-pointer hover:text-purple-600" />
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Receiver Message */}
        <div className="flex items-start gap-3">
          <img
            src="https://randomuser.me/api/portraits/women/45.jpg"
            alt="User"
            className="w-8 h-8 rounded-full"
          />
          <div className="bg-white p-3 rounded-lg shadow-md max-w-md">
            <p className="text-sm text-gray-700">
              That's awesome. I think our users will really appreciate the
              improvements.
            </p>
            <p className="text-xs text-gray-400 mt-1">11:46</p>
          </div>
        </div>

        {/* Voice Message */}
        <div className="flex items-start gap-3">
          <img
            src="https://randomuser.me/api/portraits/women/45.jpg"
            alt="User"
            className="w-8 h-8 rounded-full"
          />
          <div className="bg-white p-3 rounded-lg shadow-md max-w-md flex flex-col">
            <div className="flex items-center gap-2">
              <button className="p-1 bg-gray-300 rounded-full">▶</button>
              <div className="bg-gray-300 h-2 flex-1 rounded-md"></div>
              <span className="text-xs text-gray-500">3:42</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">11:48</p>
          </div>
        </div>

        {/* Sender Messages */}
        <div className="flex flex-col items-end space-y-2">
          <div className="flex items-start gap-3 ">
            <img
              src="https://randomuser.me/api/portraits/men/45.jpg"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <div className="bg-purple-100 p-3 rounded-lg shadow-md max-w-md">
              <p className="text-sm text-gray-700">
                I agree on this one and we should add it to the next sprint so
                that we can roll it out as soon as possible.
              </p>
              <p className="text-xs text-gray-400 text-right">11:48</p>
            </div>
          </div>
          <div className="flex items-start gap-3 ">
            <img
              src="https://randomuser.me/api/portraits/men/45.jpg"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <div className="bg-purple-100 p-3 rounded-lg shadow-md max-w-md">
              <p className="text-sm text-gray-700">
                Hey Roberta... forgot to ask, but can you please send me a pic
                of the new office?
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 ">
            <img
              src="https://randomuser.me/api/portraits/men/45.jpg"
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <div className="bg-purple-100 p-3 rounded-lg shadow-md max-w-md">
              <p className="text-sm text-gray-700">Thanks! 🙏</p>
            </div>
          </div>
          {messages.map((msg, index) => {
            const isSender = msg.sender === user?.id; // check if this message is from logged-in user
            return (
              <div
                key={index}
                className={`flex items-start gap-3 ${isSender ? "justify-end" : "justify-start"}`}
              >
                {!isSender && (
                  <img
                    src="https://randomuser.me/api/portraits/women/45.jpg"
                    alt="Receiver"
                    className="w-8 h-8 rounded-full"
                  />
                )}

                <div
                  className={`p-3 rounded-lg shadow-md max-w-md ${
                    isSender ? "bg-purple-100 text-right" : "bg-white text-left"
                  }`}
                >
                  <p className="text-sm text-gray-700">{msg.message}</p>
                </div>

                {isSender && (
                  <img
                    src="https://randomuser.me/api/portraits/men/45.jpg"
                    alt="Sender"
                    className="w-8 h-8 rounded-full"
                  />
                )}
              </div>
            );
          })}


          {/* Display Audio file/ */}
          {audioURL && (
            <div className="flex items-start gap-3 ">
              <img
                src="https://randomuser.me/api/portraits/men/45.jpg"
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <div className="bg-purple-100 p-3 rounded-lg shadow-md max-w-md">
                <p className="text-sm text-gray-700">
                  <>
                    <audio controls src={audioURL} className="mt-2" />
                    <p className="text-xs text-gray-400 text-right">11:48</p>
                  </>

                  {/* Audio Visualization */}
                  {isRecording && (
                    <canvas
                      ref={canvasRef}
                      className="w-full h-24 bg-gray-200 mt-2"
                    />
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Display uploaded file */}
          {file && (
            <div className="flex items-start gap-3">
              <img
                src="https://randomuser.me/api/portraits/men/45.jpg"
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <div className="bg-purple-100 p-3 rounded-lg shadow-md max-w-md">
                {/* Show image preview */}
                {file.type.startsWith("image/") && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Uploaded file"
                    className="max-w-xs rounded-md"
                  />
                )}

                {/* Show audio player */}
                {file.type.startsWith("audio/") && (
                  <audio controls className="w-full mt-2">
                    <source src={URL.createObjectURL(file)} type={file.type} />
                    Your browser does not support the audio tag.
                  </audio>
                )}

                {/* Show video player */}
                {file.type.startsWith("video/") && (
                  <video controls className="max-w-xs rounded-md mt-2">
                    <source src={URL.createObjectURL(file)} type={file.type} />
                    Your browser does not support the video tag.
                  </video>
                )}

                {/* Show PDF or other files */}
                {file.type === "application/pdf" && (
                  <div className="flex items-center mt-2">
                    <span className="text-red-500 font-semibold">
                      📄 PDF File:
                    </span>
                    <a
                      href={URL.createObjectURL(file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 underline"
                    >
                      {file.name}
                    </a>
                  </div>
                )}

                {/* Show generic file link for other types */}
                {!file.type.startsWith("image/") &&
                  !file.type.startsWith("audio/") &&
                  !file.type.startsWith("video/") &&
                  file.type !== "application/pdf" && (
                    <a
                      href={URL.createObjectURL(file)}
                      download={file.name}
                      className="text-blue-600 underline"
                    >
                      {file.name}
                    </a>
                  )}

                <p className="text-xs text-gray-400 mt-1">Just now</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Input */}
      <div className="flex items-center p-3 bg-white shadow-md">
        <div className="flex-1 flex items-center space-x-3 bg-gray-100 rounded-full px-4 py-2">
          {/* Emoji Picker Button */}
          <button
            onClick={() => setIsEmojiOpen(!isEmojiOpen)}
            className="text-gray-500 hover:text-purple-600"
          >
            {" "}
            😀
          </button>
          {/* Emoji Picker Dropdown */}
          {isEmojiOpen && (
            <div className="absolute bottom-12 left-0 bg-white shadow-lg rounded-lg p-2">
              <EmojiPicker onEmojiClick={handleEmojiSelect} />
            </div>
          )}
          {/* File Upload Button */}
          <label className="text-gray-500 hover:text-purple-600 cursor-pointer">
            <FaPaperclip className="text-lg" />
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
          <button className="text-gray-500 hover:text-purple-600">B</button>
          <button className="text-gray-500 hover:text-purple-600">I</button>
          <button className="text-gray-500 hover:text-purple-600">U</button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(5);
              }
            }}
          />
          {/* Voice Recorder Button */}
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className="text-gray-500 hover:text-purple-600"
          >
            <FaMicrophone className="text-lg" />
          </button>
        </div>
        <button
          className="ml-3 p-2 bg-purple-600 text-white rounded-full"
          onClick={() => sendMessage(5)}
        >
          <IoSend className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatMainContainer;
