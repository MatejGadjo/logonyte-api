const db = require('../configs/db.config');

const donationInfo = async (req, res) => {
    try {
        const sum = await db('donations').sum('amount as sum').first();
        const totalAmount = parseFloat(sum.sum);

        res.json({ totalAmount });
    } catch (error) {
        console.error('Error retriving donation information', error);
        res.status(500).json({ error: 'Internal server error'});
    }
}

module.exports = donationInfo;