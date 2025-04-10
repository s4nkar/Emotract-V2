import mongoose from "mongoose";
import Chats from "../models/Chats.js";
import Messages from "../models/messages.js";

/**
 * ✅ Send a Message
 * Saves the message, updates the chat's last message, and sets initial delivery status.
 */
export const sendMessage = async (req, res) => {
  try {
    const { from, to, message, is_group } = req.body;

    if (!from || !to || !message) {
      return res.status(400).json({ msg: "Missing required fields: from, to, message" });
    }

    if (!mongoose.Types.ObjectId.isValid(from) || !mongoose.Types.ObjectId.isValid(to)) {
      return res.status(400).json({ msg: "Invalid user ID format" });
    }

    const fromObjectId = new mongoose.Types.ObjectId(from);
    const toObjectId = new mongoose.Types.ObjectId(to);

    let chat = await Chats.findOne({ participants: { $all: [fromObjectId, toObjectId] } });

    if (!chat) {
      chat = await Chats.create({
        participants: [fromObjectId, toObjectId],
        is_group: is_group || false,
        last_message: {
          text: message,
          sender_id: fromObjectId,
          sent_at: new Date(),
        },
      });
    }

    // ✅ Add `delivery_status: "sent"`
    const messageDoc = await Messages.create({
      chat_id: chat._id,
      sender_id: fromObjectId,
      text: message,
      read_by: [fromObjectId],
      delivery_status: "sent",
      processing_status: "processing",
    });

    chat.last_message = {
      text: message,
      sender_id: fromObjectId,
      sent_at: new Date(),
    };
    await chat.save();

    return res.status(201).json({ msg: "Message sent successfully", message: messageDoc });
  } catch (error) {
    console.error("🔥 Error in sendMessage:", error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

/**
 * ✅ Receive New Messages (Polling Mechanism)
 * Fetches new messages for a user that are not marked as "read".
 */
export const receiveMessages = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid user ID format" });
    }

    const newMessages = await Messages.find({
      sender_id: { $ne: userId }, // Messages NOT sent by the user
      read_by: { $ne: userId },   // Messages NOT read by the user
      is_deleted: false,          // Exclude deleted messages
    }).sort({ sent_at: 1 });

    return res.status(200).json(newMessages);
  } catch (error) {
    console.error("🔥 Error in receiveMessages:", error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

/**
 * ✅ Fetch Previous Chat History
 * Retrieves past messages for a specific chat ID.
 */
export const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      return res.status(400).json({ msg: "Invalid chat ID format" });
    }

    const messages = await Messages.find({ chat_id: chatId, is_deleted: false })
      .sort({ sent_at: 1 }) // Oldest messages first
      .select("text sender_id sent_at read_by delivery_status processing_status");

    return res.status(200).json(messages);
  } catch (error) {
    console.error("🔥 Error in getChatMessages:", error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

/**
 * ✅ Mark a Message as Delivered
 * Updates the message status when it reaches the receiver.
 */
export const markMessageAsDelivered = async (req, res) => {
  try {
    const { messageId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ msg: "Invalid message ID format" });
    }

    const message = await Messages.findByIdAndUpdate(
      messageId,
      { delivery_status: "delivered" },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    return res.status(200).json({ msg: "Message marked as delivered", message });
  } catch (error) {
    console.error("🔥 Error in markMessageAsDelivered:", error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};

/**
 * ✅ Mark a Message as Read
 * Updates the read status of a message when the receiver views it.
 */
export const markMessageAsRead = async (req, res) => {
  try {
    const { messageId, userId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(messageId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid message ID or user ID format" });
    }

    const message = await Messages.findByIdAndUpdate(
      messageId,
      {
        $set: { delivery_status: "read" },
        $addToSet: { read_by: userId },
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    return res.status(200).json({ msg: "Message marked as read", message });
  } catch (error) {
    console.error("🔥 Error in markMessageAsRead:", error);
    return res.status(500).json({ msg: "Internal Server Error", error: error.message });
  }
};
