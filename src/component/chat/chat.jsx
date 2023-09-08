import React, { useEffect, useRef, useState } from "react";
import AxiosInstance from "../../Axios/professionalsAxios";
import UserAxiosInstance from "../../Axios/userAxios";
import { useSelector } from "react-redux";
import { useLocation } from 'react-router-dom';
import { io } from "socket.io-client";

function Chats({userType,senderId}) {
  const [socket, setSocket] = useState(null);
  const [chatList, setChatList] = useState();
  const [Id, setChatId] = useState(null);
  const [userData, setuserData] = useState(null);
  const [proData, setproData] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState(null);
  const [Typing, setTyping] = useState(false)
  const [Read, setRead] = useState(false)
  const [isRead, setIsRead] = useState(false)
  const messageHolder = useRef(null);
  const proAxios = AxiosInstance();
  const userAxios = UserAxiosInstance();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  let receiverId = null
  if(searchParams.get('receiverId')){
    receiverId=searchParams.get('receiverId');
  }
  
  let axios = null
  let storeId = null 
  if(userType=='user'){
    axios=userAxios
    storeId = useSelector((state) => state.user.Id);
  }else{
    axios=proAxios
    storeId = useSelector((store) => store.professional.proId);
  }
  
useEffect(() => {
  if (receiverId) {
    setChatId(receiverId);
  }
}, [receiverId]);

  useEffect(() => {
    if(receiverId){
      axios
      .get(`/loadChat?receiverId=${receiverId}&senderId=${senderId}&type=${userType}`)
      .then((res) => {
        if (res) {
          setproData(res.data.chat.professional)
          setuserData(res.data.chat.user)
          setMessages(res.data.chat.messages);
          setChatId(res.data.chat._id);
        } else {
          console.log(error);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }, [Id]);

  useEffect(() => {
    axios.get(`/listChat?id=${senderId}&type=${userType}`).then((res) => {
      setChatList(res.data.list);
    });
  }, [Read]);

  useEffect(() => {
    // Create a socket connection when the component mounts
    const newSocket = io("http://localhost:4000/chat");
    setSocket(newSocket);

    // Set up event listeners for socket events

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      newSocket.emit("setup", Id);
    });

    newSocket.on("messageResponse", (messageData, receivedChatId) => {
      if (Id === receivedChatId) {
        setMessages((prevMessages) => [...prevMessages, messageData]);
      }
    });

    return () => {
      // Clean up socket connection
      if (newSocket) newSocket.disconnect();
    };
  }, [Id]);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to socket server");
        socket.emit("setup", Id);
      });

      socket.on("readResponse", (receivedChatId) => {
        if (Id === receivedChatId) {
          console.log(`Chat ${receivedChatId} marked as read`);
          setIsRead(true)
          // You can update your UI to indicate that the message has been read
        }
      });
    }
  }, [socket, Id]);

  const sendMessage = () => {
    if(!message||!message.trim()){
      return;
    }

    const newMessage = {
      text: message,
      senderType: userType,
      senderId: senderId,
      timestamp: Date.now(),
    };

    if (socket && Id) {
      socket.emit("newMessage", newMessage, Id);
      socket.emit("read", Id, storeId);

    }

    setMessage("");
  };

  useEffect(() => {
    if (messageHolder.current) {
      messageHolder.current.scrollTop = messageHolder.current.scrollHeight;
    }
  }, [messages]);

  const chatHandle = (chatId)=>{
    setTyping(true)
      // Mark the messages read in the backend
      axios
      .get(`/loadChat?chatId=${chatId}`)
      .then((res) => {
        if (res) {
          setproData(res.data.chat.professional)
          setuserData(res.data.chat.user)
          setMessages(res.data.chat.messages);
          setChatId(res.data.chat._id);
          socket.emit("read", chatId, storeId);
      } else {
        console.log(error);
      }
    })
    .catch((error) => {
      console.log(error);
    });
  }

  return (
    <div>
      {/* <div className='w-4/12 h-screen flex justify-center items-center bg-black'> */}
          {/* <h1 className="text-xl m-[3%]">Chats</h1> */}
      <div className="flex h-screen full antialiased justify-center items-center text-gray-800">
        {receiverId ? (''):(
        <div className="w-5/12 h-[92%] flex justify-center items-center rounded-lg bg-gray-300 ml-2 ">
          <div className="h-[90%]  overflow-scroll w-[96%]  bg-gray-200">
			<p className="m-2 font-bold">Chats</p>
            {chatList ? (
              chatList.map((list) => {
                return (
                  <div
                  key={list._id}
                  onClick={() => chatHandle(list._id)}

                    className="m-1 bg-white h-[20%]  flex items-center"
                  >
                    <img
                      src={userType=="user"? list.professional.image:userType=="pro"?list.user.image:'null'}
                      className="h-8 rounded-full  md:block w-8 ml-[1%]"
                      alt=""
                    />
                    <div className="overflow-hidden ml-3 h-[60%]  w-full">
                      <h1 className="font-bold">{userType=="user"? list.professional.name:userType=="pro"?list.user.name:'null'}</h1>
                      {/* {messages.length > 0 
                    ? messages.map((message) => ( */}
                    <div className="flex gap-2 items-center">
                    {list.messages?list.messages[list.messages.length-1]?list.messages[list.messages.length-1].is_read:'':'' || isRead ? (
            <svg xmlns="http://www.w3.org/2000/svg" 
            height="10px" 
            viewBox="0 0 448 512"
            fill="#1D03FC"
            >
            <path d="M342.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 178.7l-57.4-57.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l80 80c12.5 12.5 32.8 12.5 45.3 0l160-160zm96 128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 402.7 54.6 297.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l256-256z"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg"
             height="10px" 
             viewBox="0 0 448 512">
<path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
</svg>
          )}
                      <small className="text-xs text-gray-300">
                        {list.messages
                          ? list.messages[list.messages.length-1]
                            ? list.messages[list.messages.length-1].text
                            : ""
                          : ""}
                      </small>
                    </div>
                    </div>
                    <div className="md:mr-[2%] text-end w-full flex-col h-full">
                      <p className="text-xs text-gray-400">
                        {list.messages &&
                        list.messages[list.messages.length-1] &&
                        list.messages[list.messages.length-1].timestamp
                          ? new Date(
                              list.messages[list.messages.length-1].timestamp
                            ).toLocaleString()
                          : ""}
                      </p>{" "}
                      {/* <div className="border mt-[50%]  rounded-full w-[40%] text-center text-xs font-bold bg-green-600 text-white h-[26%]">
												1
											</div> */}
                    </div>
                  </div>
                );
              })
            ) : (
              <div>
                <h1>No list</h1>{" "}
              </div>
            )}
          </div>
          {/* <button className="bg-black px-4 sm:hidden text-white hover:bg-white hover:text-black py-2 rounded-md">
            Back
          </button> */}
        </div>
        )}
        {/* </div> */}
        <div className="sm:flex sm:flex-row h-full w-11/12 overflow-x-hidden">
          <div className="flex flex-col flex-auto h-full p-6 ">
            <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-200 h-full p-4">
              <div
                className="flex flex-col h-full overflow-x-auto mb-4"
                ref={messageHolder}
              >
                <div className="flex flex-col h-full ">
                  {messages.length > 0 && Typing|| receiverId
                    ? messages.map((message) => (
                        <div
                          key={message._id}
                          className="grid grid-cols-12 gap-y-2"
                        >

                          {message?.senderId == senderId ? (
                            <div className="col-start-7 col-end-13 p-3 rounded-lg">
                              <div className="flex items-center justify-start flex-row-reverse">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                  <img
                                    src={message.senderType=='user'?userData.image:message.senderType=='pro'?proData.image:''}
                                    alt="Avatar"
                                    className="h-full w-full rounded-full"
                                  />
                                </div>
                                <div className="relative mr-3 w-full text-sm bg-slate-100 py-2 px-4 shadow rounded-xl">
                                  <div className="break-words">
                                    {message ? message.text : ""}
                                  </div>
                                  <small className="text-xs text-gray-400">
                                    {" "}
                                    {new Date(
                                      message?.timestamp
                                    ).toLocaleString("en-US", {
                                      hour: "numeric",
                                      minute: "numeric",
                                      hour12: true,
                                    })}
                                  </small>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="col-start-1 col-end-7 p-3 rounded-lg">
                              <div className="flex flex-row items-center">
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-500 flex-shrink-0">
                                  <img
                                     src={message.senderType=='user'?userData.image:message.senderType=='pro'?proData.image:''}

                                    alt="Avatar"
                                    className="h-full w-full rounded-full"
                                  />
                                </div>
                                <div className="relative mr-3 w-full text-sm bg-indigo-100 py-2 px-4 shadow rounded-xl">
                                  <div className="break-words">
                                    {message?.text}
                                  </div>
                                  <small className="text-xs text-gray-400">
                                    {" "}
                                    {new Date(
                                      message?.timestamp
                                    ).toLocaleString("en-US", {
                                      hour: "numeric",
                                      minute: "numeric",
                                      hour12: true,
                                    })}
                                  </small>
                                </div>
                              </div>
                            </div>
                          )}
                          <div />
                        </div>
                      ))
                    : ""}
                </div>
                <div />
              </div>
              {Typing||receiverId ? (
              <div>
                <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                  <div className="flex-grow ml-4">
                    <div className="relative w-full">
                      <input
                        onChange={(e) => setMessage(e.target.value)}
                        value={message}
                        type="text"
                        className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                        placeholder="Type your message..."
                      />
                    </div>
                  </div>
                  <div className="ml-4">
                    <button
                      onClick={sendMessage}
                      type="button"
                      className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-1 flex-shrink-0"
                    >
                      <span>Send</span>
                    </button>
                  </div>
                </div>
              </div>
              ):''}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chats;