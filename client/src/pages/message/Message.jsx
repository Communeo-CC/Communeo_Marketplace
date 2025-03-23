import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import newRequest from "../../utils/newRequest";
import "./Message.scss";
import moment from "moment";

const Message = () => {
  const { id } = useParams();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  // Get conversation details
  const { data: conversation } = useQuery({
    queryKey: ["conversation", id],
    queryFn: () => newRequest.get(`/conversations/single/${id}`).then((res) => res.data),
  });

  // Get other user's details
  const { data: otherUser } = useQuery({
    queryKey: ["user", conversation?.sellerId === currentUser._id ? conversation?.buyerId : conversation?.sellerId],
    queryFn: () => 
      newRequest
        .get(`/users/${conversation?.sellerId === currentUser._id ? conversation?.buyerId : conversation?.sellerId}`)
        .then((res) => res.data),
    enabled: !!conversation,
  });

  // Get messages
  const { isLoading, error, data: messages } = useQuery({
    queryKey: ["messages", id],
    queryFn: () => newRequest.get(`/messages/${id}`).then((res) => res.data),
  });

  const mutation = useMutation({
    mutationFn: (message) => {
      return newRequest.post(`/messages`, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const messageText = e.target[0].value.trim();
    
    if (!messageText) return;
    
    mutation.mutate({
      conversationId: id,
      desc: messageText,
    });
    e.target[0].value = "";
  };

  return (
    <div className="message">
      <div className="container">
        <span className="breadcrumbs">
          <Link to="/messages">Messages</Link> {' > '} 
          {otherUser ? (
            <span>{otherUser.username}</span>
          ) : (
            <span>Loading...</span>
          )}
        </span>
        
        <div className="messages-container">
          {isLoading ? (
            <div className="loading">Loading messages...</div>
          ) : error ? (
            <div className="error">Error loading messages</div>
          ) : (
            <div className="messages">
              {messages.map((m) => (
                <div className={m.userId === currentUser._id ? "owner item" : "item"} key={m._id}>
                  <img
                    src={m.userId === currentUser._id ? currentUser.img || "/img/noavatar.jpg" : otherUser?.img || "/img/noavatar.jpg"}
                    alt=""
                  />
                  <div className="message-content">
                    <p>{m.desc}</p>
                    <span className="timestamp">{moment(m.createdAt).fromNow()}</span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        
        <hr />
        <form className="write" onSubmit={handleSubmit}>
          <textarea 
            type="text" 
            placeholder="Write a message..." 
            rows="3"
          />
          <button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Message;
