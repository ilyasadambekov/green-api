interface IResponse {
  receiptId: number;
  body: ResponseBody;
}

interface ResponseBody {
  typeWebhook: string;
  instanceData: InstanceData;
  timestamp: number;
  idMessage: string;
  senderData: SenderData;
  messageData: MessageData;
}

interface MessageData {
  typeMessage: string;
  textMessageData: TextMessageData;
}

interface TextMessageData {
  textMessage: string;
}

interface SenderData {
  chatId: string;
  chatName: string;
  sender: string;
  senderName: string;
  senderContactName: string;
}

interface InstanceData {
  idInstance: number;
  wid: string;
  typeInstance: string;
}

interface IMessage {
  id: number;
  sender: string;
  text: string;
}
