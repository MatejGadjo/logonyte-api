const db = require('../configs/db.config');

const support = async (req, res) => {
  try{
    const donationData = req.body.data;

    const { supporter_email, amount } = donationData;

    await db('donations').insert({
      supporter_email,
      amount,
    });

    console.log('Donation inserted successfully');
    res.status(200).json({ message: 'Donation inserted successfully' });
  } catch (error) {
    console.error('Error processing donation notification', error);
    res.status(500).json({ message: 'Error processing donation notification' });
  }
}

module.exports = support;