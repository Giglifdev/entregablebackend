import mongoose from "mongoose";

const messagesCollection = "messages";

const messagesSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
    immutable: true,
    match: [
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
      "Please fill a valid email address",
    ],
  },
  message: {
    type: String,
    required: true,
  },
});

export const messagesModel = mongoose.model(messagesCollection, messagesSchema);
