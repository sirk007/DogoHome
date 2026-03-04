import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  TextField,
} from "@mui/material";
import { fetchUserConversation, sendMessageUser } from "../../api/message.api";
import type { Message } from "../../types/message.types";

const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");

  const loadConversation = async (otherId: number) => {
    const msgs = await fetchUserConversation(otherId);
    setConversations(msgs);
    setSelectedUserId(otherId);
  };

  const handleSend = async () => {
    if (!selectedUserId || !messageText.trim()) return;
    await sendMessageUser({ receiverId: selectedUserId, content: messageText });
    setMessageText("");
    if (selectedUserId) loadConversation(selectedUserId);
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>
        Messages
      </Typography>

      {/* Conversation list */}
      <List>
        {conversations.map((msg) => (
          <ListItem key={msg.id}>
            <ListItemText
              primary={msg.content}
              secondary={new Date(msg.createdAt).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>

      {/* Message input */}
      {selectedUserId && (
        <Box display="flex" gap={1} mt={2}>
          <TextField
            fullWidth
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type a message..."
          />
          <Button variant="contained" onClick={handleSend}>
            Send
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default MessagesPage;
