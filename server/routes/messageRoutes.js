import express from "express";
import { 
  sendMessage, 
  receiveMessages,  // ✅ Receive new messages
  getChatMessages, 
  markMessageAsDelivered, 
  markMessageAsRead,
  deleteMessageForMe,      // ✅ New: Soft delete for a user
  deleteMessageForEveryone // ✅ New: Hard delete for all users
} from "../controllers/messageController.js";

const router = express.Router();

// ✅ Send a new message
router.post("/send-message", sendMessage);

// ✅ Receive new messages (Polling)
router.get("/receive/:userId", receiveMessages);

// ✅ Get messages for a chat
router.get("/messages/:chatId", getChatMessages);

// ✅ Mark a message as delivered
router.put("/messages/:messageId/delivered", markMessageAsDelivered);

// ✅ Mark a message as read
router.put("/messages/read", markMessageAsRead);

// ✅ Delete a message for the current user (Soft delete)
router.put("/messages/delete-for-me", deleteMessageForMe);

// ✅ Delete a message for everyone (Hard delete)
router.put("/messages/delete-for-everyone/:messageId", deleteMessageForEveryone);

export default router;
