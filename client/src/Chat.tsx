import { useEffect, useState } from 'react'
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);

  const sendMessage = async () => {
    if (currentMessage) {
      const messageData = {
        room,
        username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
      }

      await socket.emit('send_message', messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage('');
    }
  }

  useEffect(() => {
    socket.on('recive_message', (data) => {
      setMessageList((list) => [...list, data]);
    })
  }, [socket]);

  return (
    <div className='chat-window'>
      <div className="chat-header">
        <p>Live Chat</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {
            messageList.map((messageData) => {
              return <div className="message" id={username === messageData.username ? 'other' : 'you'}>
                <div>
                  <div className="message-content">
                    <p>{messageData.message}</p>
                  </div>
                  <div className="message-meta">
                    <p>{messageData.time}</p>
                    <p>{messageData.username}</p>
                  </div>
                </div>
              </div>
            })
          }
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input type="text" placeholder='Write a message' value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  )
}

export default Chat;