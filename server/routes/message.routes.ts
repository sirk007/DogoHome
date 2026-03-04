import { Router } from "express";
import db from "../models";
import { Op } from "sequelize";
import { validateUserToken } from "../middleware/user.middleware";
import { validateShelterToken } from "../middleware/shelter.middleware";

const router = Router();
const { Message } = db;

// ---------------------------
// USER SEND MESSAGE
// ---------------------------
router.post("/user/send", validateUserToken, async (req: any, res) => {
  const senderId = req.user.id;
  const { receiverId, content, animalId } = req.body;

  if (!receiverId || !content) {
    return res
      .status(400)
      .json({ error: "receiverId and content are required" });
  }

  try {
    const message = await Message.create({
      senderId,
      receiverId,
      content,
      animalId: animalId || null,
    });

    res.status(201).json(message);
  } catch (err: any) {
    console.error("User send message error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------
// SHELTER SEND MESSAGE
// ---------------------------
router.post("/shelter/send", validateShelterToken, async (req: any, res) => {
  const senderId = req.shelter.id;
  const { receiverId, content, animalId } = req.body;

  if (!receiverId || !content) {
    return res
      .status(400)
      .json({ error: "receiverId and content are required" });
  }

  try {
    const message = await Message.create({
      senderId,
      receiverId,
      content,
      animalId: animalId || null,
    });

    res.status(201).json(message);
  } catch (err: any) {
    console.error("Shelter send message error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------
// USER FETCH CONVERSATION
// ---------------------------
router.get("/user/conversation", validateUserToken, async (req: any, res) => {
  const currentUserId = req.user.id;
  const { otherId, animalId } = req.query;

  if (!otherId) return res.status(400).json({ error: "otherId is required" });

  const where: any = {
    [Op.or]: [
      { senderId: currentUserId, receiverId: Number(otherId) },
      { senderId: Number(otherId), receiverId: currentUserId },
    ],
  };

  if (animalId) where.animalId = Number(animalId);

  try {
    const messages = await Message.findAll({
      where,
      order: [["createdAt", "ASC"]],
    });

    res.json(messages);
  } catch (err: any) {
    console.error("User fetch conversation error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------
// SHELTER FETCH CONVERSATION
// ---------------------------
router.get(
  "/shelter/conversation",
  validateShelterToken,
  async (req: any, res) => {
    const currentUserId = req.shelter.id;
    const { otherId, animalId } = req.query;

    if (!otherId) return res.status(400).json({ error: "otherId is required" });

    const where: any = {
      [Op.or]: [
        { senderId: currentUserId, receiverId: Number(otherId) },
        { senderId: Number(otherId), receiverId: currentUserId },
      ],
    };

    if (animalId) where.animalId = Number(animalId);

    try {
      const messages = await Message.findAll({
        where,
        order: [["createdAt", "ASC"]],
      });

      res.json(messages);
    } catch (err: any) {
      console.error("Shelter fetch conversation error:", err);
      res.status(500).json({ error: err.message });
    }
  },
);

// ---------------------------
// SHELTER FETCH CONVERSATIONS LIST
// ---------------------------
router.get(
  "/shelter/conversations",
  validateShelterToken,
  async (req: any, res) => {
    const shelterId = req.shelter.id;

    try {
      // Get all messages where shelter is sender OR receiver
      const messages = await Message.findAll({
        where: {
          [Op.or]: [{ senderId: shelterId }, { receiverId: shelterId }],
        },
        order: [["createdAt", "DESC"]],
      });

      // Extract unique userIds (excluding shelterId)
      const conversationsMap = new Map<number, string>();

      for (const msg of messages) {
        const otherId =
          msg.senderId === shelterId ? msg.receiverId : msg.senderId;

        // Only add first (latest) message per user
        if (!conversationsMap.has(otherId)) {
          conversationsMap.set(otherId, msg.content);
        }
      }

      const conversationsList = Array.from(conversationsMap.entries()).map(
        ([userId, lastMessage]) => ({
          userId,
          lastMessage,
        }),
      );

      res.json(conversationsList);
    } catch (err: any) {
      console.error("Shelter conversations list error:", err);
      res.status(500).json({ error: err.message });
    }
  },
);

export default router;
