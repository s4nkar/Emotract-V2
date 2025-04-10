import express from "express";
import { 
  sendMessage, 
  receiveMessages,  // ✅ Receive new messages
  getChatMessages, 
  markMessageAsDelivered, 

  
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



export default router;
