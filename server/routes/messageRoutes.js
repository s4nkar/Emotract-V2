import express from "express";
import { 
  sendMessage, 
  getChatMessages, 
  markMessageAsDelivered, 
  markMessageAsRead 
} from "../controllers/messagecontroller.js";

const router = express.Router();

// ✅ Send a new message
router.post("/send-message", sendMessage);

// ✅ Get messages for a chat
router.get("/messages/:chatId", getChatMessages);

// ✅ Mark a message as delivered
router.put("/message/:messageId/delivered", markMessageAsDelivered);

// ✅ Mark a message as read
router.put("/message/read", markMessageAsRead);

export default router;
