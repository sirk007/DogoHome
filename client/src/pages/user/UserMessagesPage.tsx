import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
  Button,
} from "@mui/material";
import {
  fetchShelterConversationsList,
  fetchShelterConversation,
  sendMessageShelter,
} from "../../api/message.api";
import type { Message } from "../../types/message.types";

interface ConversationUser {
  userId: number;
  lastMessage: string;
}

const ShelterMessagesPage: React.FC = () => {
  const [usersList, setUsersList] = useState<ConversationUser[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [conversations, setConversations] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");

  // Load conversation for a selected user
  const loadConversation = async (userId: number) => {
    const msgs = await fetchShelterConversation(userId);
    setConversations(msgs);
    setSelectedUserId(userId);
  };

  // Send a reply
  const handleSend = async () => {
    if (!selectedUserId || !messageText.trim()) return;

    await sendMessageShelter({
      receiverId: selectedUserId,
      content: messageText,
    });

    setMessageText("");
    loadConversation(selectedUserId); // refresh after send
  };

  // Fetch all users who messaged the shelter
  useEffect(() => {
    const fetchUsers = async () => {
      const list = await fetchShelterConversationsList();
      setUsersList(list);

      if (list.length > 0) loadConversation(list[0].userId); // preload first conversation
    };
    fetchUsers();
  }, []);

  return (
    <Box display="flex" gap={2} height="100%">
      {/* Left pane: user list */}
      <Box
        width="220px"
        border="1px solid #ccc"
        borderRadius={1}
        overflow="auto"
      >
        <List>
          {usersList.map((u) => (
            <ListItem key={u.userId} disablePadding>
              <ListItemButton
                selected={u.userId === selectedUserId}
                onClick={() => loadConversation(u.userId)}
              >
                <ListItemText
                  primary={`User ${u.userId}`}
                  secondary={u.lastMessage}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Right pane: conversation */}
      <Box flex={1} display="flex" flexDirection="column">
        <List
          sx={{
            flex: 1,
            maxHeight: 400,
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: 1,
          }}
        >
          {conversations.map((msg) => (
            <ListItem key={msg.id} disablePadding>
              <ListItemText
                primary={msg.content}
                secondary={`${
                  msg.senderId === selectedUserId ? "User" : "You"
                } • ${new Date(msg.createdAt).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>

        {/* Reply box */}
        {selectedUserId && (
          <Box display="flex" gap={1} mt={2}>
            <TextField
              fullWidth
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type your reply..."
            />
            <Button variant="contained" onClick={handleSend}>
              Send
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ShelterMessagesPage;
