// src/components/ChatRoom.js
import React, { useState, useEffect } from "react";
import { firestore } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import SearchUser from "./SearchUser";

const ChatRoom = ({ user }) => {
  const [chats, setChats] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // State to track selected user

  useEffect(() => {
    const chatsCollection = collection(firestore, "chats");
    const q = query(chatsCollection, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChats(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !selectedUser) return; // Check if a user is selected

    await addDoc(collection(firestore, "chats"), {
      text: newMessage,
      senderId: user.uid,
      senderName: user.displayName,
      receiverId: selectedUser.uid,
      receiverName: selectedUser.displayName,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  return (
    <div className="chat-container">
      <SearchUser onSelectUser={setSelectedUser} />{" "}
      {/* Pass the setSelectedUser to handle user selection */}
      {selectedUser != null ? (<div className="chat-window">
        <div className="chat-header">Messages</div>
        {selectedUser && (
          <div>
            Chatting with{" "}
            <span style={{ color: "green" }}>{selectedUser.displayName}</span>
          </div>
        )}
        <div className="chat-messages">
          {chats
            .filter(
              (chat) =>
                (chat.senderId === user.uid &&
                  chat.receiverId === selectedUser?.uid) ||
                (chat.senderId === selectedUser?.uid &&
                  chat.receiverId === user.uid)
            ) // Filter messages between current user and selected user
            .map((chat) => (
              <div
                key={chat.id}
                className={`message ${
                  chat.senderId === user.uid ? "sent" : "received"
                }`}
              >
                <strong>{chat.senderName}</strong>: {chat.text}
              </div>
            ))}
        </div>
        <form className="chat-input" onSubmit={sendMessage}>
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>):(
        <div className="chat-header2">Select a user</div>
      )}
      
    </div>
  );
};

export default ChatRoom;
