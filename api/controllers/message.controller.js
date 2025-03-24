import createError from "../utils/createError.js";
import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const createMessage = async (req, res, next) => {
  const newMessage = new Message({
    conversationId: req.body.conversationId,
    userId: req.userId,
    desc: req.body.desc,
  });
  
  try {
    // Save the message
    const savedMessage = await newMessage.save();
    
    // Get the conversation to determine roles
    const conversation = await Conversation.findOne({ id: req.body.conversationId });
    if (!conversation) {
      return next(createError(404, "Conversation not found"));
    }

    // Update conversation read status and last message
    await Conversation.findOneAndUpdate(
      { id: req.body.conversationId },
      {
        $set: {
          readBySeller: req.userId === conversation.sellerId,
          readByBuyer: req.userId === conversation.buyerId,
          lastMessage: req.body.desc,
        },
      },
      { new: true }
    );

    res.status(201).send(savedMessage);
  } catch (err) {
    next(err);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id });
    res.status(200).send(messages);
  } catch (err) {
    next(err);
  }
};
