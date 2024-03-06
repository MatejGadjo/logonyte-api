const db = require('../configs/db.config');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const changepassword = (req, res) => {
  const { oldPassword, newPassword, email } = req.body;

  db.select('email','hash').from('login')
    .where('email', '=', email)
    .then(result => {
      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const hashMatches = bcrypt.compareSync(oldPassword, result[0].hash);

      if (!hashMatches) {
        return res.status(401).json({ message: "Old password is incorrect." });
      }

      // Hash the new password and update in db

      const hashedNewPassword = bcrypt.hashSync(newPassword, saltRounds);
      db('login')
        .where('email', '=', email)
        .update({ hash: hashedNewPassword })
        .then(() => {
          res.json({ message: "Password changed successfully." });
        })
        .catch(err => {
          console.error("Error updating password", err);
          res.status(500).json({ message: "Error updating password " });
        });
    })
    .catch(err => {
      console.error("Error checking old password", err);
      res.status(500).json({ message: "Error checking old password." });
    })
};

module.exports = changepassword;
