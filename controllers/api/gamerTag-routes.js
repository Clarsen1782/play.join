const router = require('express').Router();
const { GamerTag } = require('../../models');

router.post('/', async (req, res) => {
    try {
        const newGamerTag = await GamerTag.create({
            ...req.body, // assuming body contains necessary gamer tag fields
            userId: req.session.userId // or however you handle user sessions
        });
        res.status(201).json(newGamerTag);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;