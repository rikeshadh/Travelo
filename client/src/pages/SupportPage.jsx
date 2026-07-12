import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const SupportPage = () => {
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  
  // Admin-specific support states
  const [conversations, setConversations] = useState([]);
  const [selectedConvoUserId, setSelectedConvoUserId] = useState('');
  const [selectedConvoUserName, setSelectedConvoUserName] = useState('');

  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const targetUser = user.role === 'admin' ? selectedConvoUserId : user.id;
      if (!targetUser) return;

      const res = await axios.get(`/api/chat/messages?userId=${targetUser}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching chat history', err);
    }
  };

  const fetchConversations = async () => {
    if (user.role !== 'admin') return;
    try {
      const res = await axios.get('/api/chat/admin/conversations');
      setConversations(res.data);
      if (res.data.length > 0 && !selectedConvoUserId) {
        setSelectedConvoUserId(res.data[0]._id);
        setSelectedConvoUserName(res.data[0].userName);
      }
    } catch (err) {
      console.error('Error fetching support tickets list', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMessages();
      fetchConversations();
      
      // Auto-refresh chat thread every 5 seconds
      const timer = setInterval(() => {
        fetchMessages();
        if (user.role === 'admin') fetchConversations();
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [user, selectedConvoUserId]);

  useEffect(() => {
    // Scroll chat to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const payload = { message: inputText };
      if (user.role === 'admin') {
        payload.targetUserId = selectedConvoUserId;
      }

      const res = await axios.post('/api/chat/send', payload);
      setMessages((prev) => [...prev, res.data]);
      setInputText('');
    } catch (err) {
      console.error('Error sending message', err);
    }
  };

  return (
    <div style={{ paddingTop: '100px', maxWidth: '1000px', margin: '0 auto 60px', paddingLeft: '20px', paddingRight: '20px' }}>
      <h2 style={{ marginBottom: '8px' }}>Customer Support Center</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
        {user?.role === 'admin' ? 'Reply to traveler support queries.' : 'Ask us anything about bookings, refunds, or properties.'}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: user?.role === 'admin' ? '280px 1fr' : '1fr', gap: '20px' }}>
        
        {/* Admin Support Conversations List */}
        {user?.role === 'admin' && (
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '15px', height: '500px', overflowY: 'auto' }}>
            <h4 style={{ marginBottom: '15px', fontWeight: 'bold' }}>Active Chats</h4>
            {conversations.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No support inquiries yet.</p>
            ) : (
              conversations.map((c) => (
                <div
                  key={c._id}
                  onClick={() => { setSelectedConvoUserId(c._id); setSelectedConvoUserName(c.userName); }}
                  style={{
                    padding: '12px',
                    borderRadius: '10px',
                    background: selectedConvoUserId === c._id ? 'rgba(245, 80, 61, 0.08)' : 'transparent',
                    border: selectedConvoUserId === c._id ? '1px solid var(--accent-color)' : '1px solid transparent',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: 'bold', fontSize: '14px', color: selectedConvoUserId === c._id ? 'var(--accent-color)' : 'var(--text-color)' }}>{c.userName}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>{c.lastMessage}</div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Chat Conversation Thread */}
        <div className="chat-container">
          <div className="chat-header">
            {user?.role === 'admin' ? `Chatting with: ${selectedConvoUserName || 'User'}` : 'Travelo Assistant'}
          </div>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <div style={{ margin: 'auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                <i className="fas fa-comments" style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--accent-color)' }}></i>
                <p>Hello! How can we assist you today?</p>
              </div>
            ) : (
              messages.map((m) => {
                // Sender determination logic (users see admin as 'admin', and themselves as 'user')
                const isMyMessage = (user.role === 'admin' && m.sender === 'admin') || (user.role !== 'admin' && m.sender === 'user');
                return (
                  <div
                    key={m._id}
                    className={`chat-bubble ${isMyMessage ? 'user' : 'admin'}`}
                  >
                    <div>{m.message}</div>
                    <div style={{ fontSize: '9px', textAlign: 'right', marginTop: '4px', opacity: 0.8 }}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-input-area">
            <input
              type="text"
              placeholder="Type your message here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              required
            />
            <button type="submit" className="chat-send-btn">
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
