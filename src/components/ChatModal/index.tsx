import styles from './index.module.scss';
import { Button, Input, Modal, Space } from 'antd';
import { FC, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { CloseOutlined, SendOutlined } from '@ant-design/icons';
import UserStore from '../../stores/UserStore.ts';
import axios from 'axios';

interface IProps {
  phone: string;
  open: boolean;
  onCancel: () => void;
}

const receiveMessages = async () => {
  if (!UserStore.credentials) return;

  try {
    const response = await axios.get<IResponse>(
      `https://api.green-api.com/waInstance${UserStore.credentials.idInstance}/receiveNotification/${UserStore.credentials.apiTokenInstance}`
    );

    if (response.data && response.data.body) {
      return response.data;
    }

    return null;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return null;
  }
};

const sendMessage = async (phone: string, message: string) => {
  if (!UserStore.credentials) return;

  try {
    const response = await axios.post(
      `https://api.green-api.com/waInstance${UserStore.credentials.idInstance}/sendMessage/${UserStore.credentials.apiTokenInstance}`,
      {
        chatId: `${phone}@c.us`,
        message,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

const ChatModal: FC<IProps> = ({ phone, open, onCancel }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [message, setMessage] = useState('');
  const messagesWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMessages([]);
  }, [phone]);

  useEffect(() => {
    const clearMessagesQueue = async () => {
      if (!UserStore.credentials) return;

      try {
        await axios.get(
          `https://api.green-api.com/waInstance${UserStore.credentials.idInstance}/clearMessagesQueue/${UserStore.credentials.apiTokenInstance}`
        );
      } catch (error) {
        console.error('Error clearing queue:', error);
      }
    };

    clearMessagesQueue();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!UserStore.credentials || !phone) return;

      const messagesData = await receiveMessages();

      if (messagesData) {
        if (messagesData.body.senderData && messagesData.body.messageData.textMessageData) {
          const newMessage = {
            id: messagesData.receiptId,
            sender: messagesData.body.senderData.sender,
            text: messagesData.body.messageData.textMessageData.textMessage,
          };

          setMessages((prev) => {
            if (!prev.some((msg) => msg.id === newMessage.id)) {
              return [...prev, newMessage];
            }
            return prev;
          });
        }

        await axios.delete(
          `https://api.green-api.com/waInstance${UserStore.credentials.idInstance}/deleteNotification/${UserStore.credentials.apiTokenInstance}/${messagesData.receiptId}`
        );
      }
    };

    fetchMessages();

    const interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval);
  }, [UserStore.credentials, phone]);

  useEffect(() => {
    if (messagesWrapRef.current) {
      messagesWrapRef.current.scrollTop = messagesWrapRef.current.scrollHeight;
    }
  }, [messagesWrapRef.current]);

  const handleSendMessage = async () => {
    if (!phone || !message) return;

    try {
      await sendMessage(phone.replace(/\D/g, ''), message);
      setMessages((prev) => [...prev, { id: Date.now(), sender: 'me', text: message }]);
      setMessage('');
    } catch {
      console.error('Failed to send message');
    }
  };

  return (
    <Modal centered closable={false} footer={null} open={open} onCancel={onCancel}>
      <div className={styles.header}>
        {phone}
        <Button type="text" shape="circle" icon={<CloseOutlined />} onClick={onCancel} />
      </div>

      <div className={styles.body}>
        <div className={styles.messagesWrap} ref={messagesWrapRef}>
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={styles.message}
              style={{ alignSelf: msg.sender === 'me' ? 'end' : 'start' }}
            >
              {msg.text}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.footer}>
        <Space.Compact block>
          <Input
            placeholder="Введите сообщение"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button icon={<SendOutlined />} type="primary" onClick={handleSendMessage} />
        </Space.Compact>
      </div>
    </Modal>
  );
};

export default observer(ChatModal);
