const db = require('../configs/db.config');
require('dotenv').config();
const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(process.env.MJ_APIKEY_PUBLIC, process.env.MJ_APIKEY_PRIVATE)

const customlogo = (req, res) => {
  const { email, username, style, iconsMascots, slogan, industry, colorTheme } = req.body;

  // Fetch the user's ID based on the provided email from the users table
  db.select('id').from('users').where('email', '=', email)
    .then((rows) => {
      if (rows.length === 0) {
        // user with the provided email not found
        return res.status(404).json({ message: "User not found." });
      }

      const userId = rows[0].id;

      // Fetch the most recent previous request timestamp for the user from the custom_logos table
      db.select('request_timestamp').from('custom_logos')
        .where('user_id', '=', userId)
        .orderBy('request_timestamp', 'desc')
        .limit(1)
        .then((rows) => {
          const currentTimestamp = new Date();
          const oneWeekAgo = new Date(currentTimestamp - 7 * 24 * 60 * 60 * 1000);

          if (rows.length > 0) {
            const mostRecentTimestamp = new Date(rows[0].request_timestamp);

            if (mostRecentTimestamp >= oneWeekAgo) {
              // user has reached the limit (1 minute) for custom logo requests
              return res.status(403).json({ message: "You have reached the request limit. Please try again later." });
            }
          }

          // Record the custom logo request in the database
          db.insert({ user_id: userId, request_timestamp: currentTimestamp }).into('custom_logos')
            .then(() => {
              // Send the email
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
                          Email: 'logonyteform@gmail.com',
                          Name: 'LogoNyte',
                        },
                      ],
                      Subject: 'New Order!',
                      TextPart: `Style: ${style}\nIcons/Mascots: ${iconsMascots}\nSlogan: ${slogan}\nIndustry: ${industry}\nColorTheme: ${colorTheme}\nEmail: ${email}\nUsername: ${username}`,
                      HTMLPart: `<h3>Style:</h3>${style}<br><h3>Icons/Mascots:</h3>${iconsMascots}<br><h3>Slogan:</h3>${slogan}<br><h3>Industry:</h3>${industry}<br><h3>ColorTheme:</h3>${colorTheme}<br><h3>Email:</h3>${email}<br><h3>Username:</h3>${username}`,
                    },
                  ],
                });

              request
                .then((result) => {
                  console.log(result.body);
                  res.json({ message: 'Email sent successfully!' });
                })
                .catch((err) => {
                  console.log(err.statusCode);
                  res.status(500).send('Error sending email.');
                });
            })
            .catch((err) => {
              console.error("Error recording request", err);
              res.status(500).send("Error recording request");
            });
        })
        .catch((err) => {
          console.error('Error checking request count:', err);
          res.status(500).send('Error checking request count.');
        });
    })
    .catch((err) => {
      console.error('Error fetching user ID:', err);
      res.status(500).send('Error fetching user ID.');
    });
};

module.exports = customlogo;