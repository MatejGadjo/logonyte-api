const db = require('../configs/db.config');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const changepassword = async (req, res) => {
  const { oldPassword, newPassword, email } = req.body;

  try {
    const result = await db.select('email', 'hash').from('login')
      .where('email', '=', email);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashMatches = bcrypt.compareSync(oldPassword, result[0].hash);

    if (!hashMatches) {
      return res.status(401).json({ message: "Old password is incorrect." });
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, saltRounds);

    try {
      await db('login')
        .where('email', '=', email)
        .update({ hash: hashedNewPassword });
      res.json({ message: "Password changed successfully." });
    }
    catch (error) {
      console.error("Error updating password", error);
      res.status(500).json({ message: "Error updating password " });
    };
  }
  catch (error) {
    console.error("Error checking old password", error);
    res.status(500).json({ message: "Error checking old password." });
  }

};

module.exports = changepassword;
