const db = require('../configs/db.config');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const resetpassword = (req, res) => {
  const { token, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, saltRounds);

  db.select('id', 'reset_token_expiration').from('login')
    .where('reset_token', '=', token)
    .andWhere('reset_token_expiration', '>', new Date())
    .then(user => {
      if (user.length === 0) {
        return res.status(403).json({ message: "Invalid or expired token." });
      } else {
        db('login')
          .where('id', '=', user[0].id)
          .update({
            hash: hashedPassword,
            reset_token: null,
            reset_token_expiration: null
          })
          .then(() => {
            res.json({ message: "Password reset succesful!" });
          })
          .catch(err => {
            console.error("Error updating password and reset_token", err);
            res.status(500).json({ message: "Error updating password and reset_token " });
          });
      }
    })
    .catch(err => {
      console.error("Error checking token", err);
      res.status(500).json({ message: "error checking token. " });
    })
}

module.exports = resetpassword