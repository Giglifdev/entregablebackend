import { messagesModel } from "./models/messages.model.js";

export default class Messages {
  constructor() {}

  getAll = async () => {
    const messages = await messagesModel.find().lean();
    return messages;
  };

  create = async ({ user, message }) => {
    const messageUser = { user, message };
    const result = messagesModel.create(messageUser);
    return result;
  };
}
