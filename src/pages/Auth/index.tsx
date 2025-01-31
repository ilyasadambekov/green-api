import styles from './index.module.scss';
import { observer } from 'mobx-react-lite';
import { Button, Form, FormProps, Input } from 'antd';
import UserStore, { ICredentials } from '../../stores/UserStore.ts';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const navigate = useNavigate();

  const onFinish: FormProps<ICredentials>['onFinish'] = (values) => {
    UserStore.setCredentials(values);
    navigate('/create');
  };

  return (
    <div className={styles.authPage}>
      <Form layout="vertical" requiredMark={false} onFinish={onFinish}>
        <Form.Item<ICredentials>
          name="idInstance"
          rules={[{ required: true, message: 'Укажите idInstance' }]}
        >
          <Input placeholder="idInstance" />
        </Form.Item>

        <Form.Item<ICredentials>
          name="apiTokenInstance"
          rules={[{ required: true, message: 'Укажите apiTokenInstance' }]}
        >
          <Input placeholder="apiTokenInstance" />
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit" type="primary" block>
            Продолжить
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default observer(AuthPage);
