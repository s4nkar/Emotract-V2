import mongoose from "mongoose";

const MessageSchema = mongoose.Schema(
  {
    chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chats",
      required: true,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    text: { type: String, required: true },

    sent_at: {
      type: Date,
      default: Date.now,
    },

    read_by: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],

    is_active: {
      type: Boolean,
      default: true,
    },

    delivery_status: {
      type: String,
      enum: ["sent", "delivered", "read"], // Only allow these values
      default: "sent", // Default to "sent"
    },

    processing_status: {
      type: String,
      default: "processing",
    },

    reaction: {
      emoji: { type: String },
      reacted_by: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
      reacted_at: {
        type: Date,
        default: Date.now,
      },
    },

   
    deleted_for: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Users" }
    ],

    
    is_deleted: {
      type: Boolean,
      default: false, // False means message exists, True means deleted for everyone
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Messages", MessageSchema);
