const router = require('express').Router();
const { Message, User } = require('../../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// POST endpoint to send a message
router.post('/', async (req, res) => {
    try {
        const { senderId, receiverId, text } = req.body;
        const message = await Message.create({ senderId, receiverId, text });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET endpoint to retrieve messages between two users
router.get('/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const otherUserId = req.query.otherUserId; // Assuming this is passed as a query parameter

        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId, receiverId: otherUserId },
                    { senderId: otherUserId, receiverId: userId }
                ]
            },
            include: [{ model: User, as: 'sender' }, { model: User, as: 'receiver' }]
        });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;