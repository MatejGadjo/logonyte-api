const db = require('../configs/db.config');
const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)

const crypto = require('crypto');

const generateRandomToken = (length) => {
  return crypto.randomBytes(length).toString('hex');
}

const sendPasswordResetEmail = (email, resetToken) => {
  const request = mailjet
    .post('send', { version: 'v3.1' })
    .request({
      Messages: [
        {
          From: {
            Email: 'logonyte@gmail.com',
            Name: 'LogoNyte',
          },
          To: [
            {
              Email: email,
            },
          ],
          Subject: 'Password Reset',
          HTMLPart: `
            <p>Hello,</p>
            <p>We received a request to reset your password. Click the link below to reset your password:</p>
            <a href="http://localhost:3001/resetpassword/${resetToken}">Reset Password</a>
            <p>Token expires in one hour.</p>
            <p>If you didn't request this, you can safely ignore this email.</p>
            <p>Best regards,</p>
            <p>Your App Team</p>
          `,
        },
      ],
    });

  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
}

const forgotpassword = (req, res) => {

  const { email } = req.body;
  // Check if email is in the db
  db.select('id', 'email').from('login')
    .where('email', '=', email)
    .then(user => {
      if (user.length === 0) {
        return res.status(404).json({ message: "User not found" });
      } else {
        // Generate passsword reset token and send it to user email
        const resetToken = generateRandomToken(32);// implenet a function to generate a random token
        const tokenExpiration = new Date(Date.now() + 30 * 60 * 1000);
        sendPasswordResetEmail(email, resetToken);// implement a function to send the email with the reset token
        db('login')
          .where('id', '=', user[0].id)
          .update({ reset_token: resetToken, reset_token_expiration: tokenExpiration })
          .then(() => {
            res.json({ message: "Password reset email sent successfully!" });
          })
          .catch(err => {
            console.error("Error checking email:", err);
            res.status(500).json({ message: "Error checking email. " });
          });
      }
    })
};

module.exports = forgotpassword;