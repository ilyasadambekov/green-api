import styles from './index.module.scss';
import { observer } from 'mobx-react-lite';
import { Form, Button, Input, Space } from 'antd';
import ChatModal from '../../components/ChatModal';
import { useState } from 'react';
import InputMask from 'react-input-mask';

type FieldType = {
  phone: string;
};

const ChatPage = () => {
  const [phone, setPhone] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const onFinish = () => {
    setModalOpen(true);
  };

  return (
    <>
      <div className={styles.chatPage}>
        <Form onFinish={onFinish}>
          <Space.Compact>
            <Form.Item<FieldType>
              name="phone"
              rules={[{ required: true, message: 'Укажите номер' }]}
            >
              <InputMask
                mask="+9 (999) 999 99 99"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              >
                {(inputProps) => <Input {...inputProps} placeholder="Введите номер" />}
              </InputMask>
            </Form.Item>

            <Form.Item>
              <Button htmlType="submit" type="primary" block>
                Открыть чат
              </Button>
            </Form.Item>
          </Space.Compact>
        </Form>
      </div>

      <ChatModal phone={phone} open={modalOpen} onCancel={() => setModalOpen(false)} />
    </>
  );
};

export default observer(ChatPage);
