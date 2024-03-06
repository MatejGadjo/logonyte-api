const db = require('../configs/db.config');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const register = (req, res) => {
  const { username, email, password } = req.body
  bcrypt.hash(password, saltRounds)
    .then((hash) => {
      return db.transaction(trx => {
        trx.insert({
          hash: hash,
          email: email
        })
          .into('login')
          .returning('email')
          .then(loginEmail => {
            return trx('users')
              .returning('*')
              .insert({
                username: username,
                email: loginEmail[0].email,
                joined: new Date()
              })
              .then(user => {
                res.json(user[0])
              })
          })
          .then(trx.commit)
          .catch(trx.rollback)
      })
    })
    .catch(err => res.status(400).json({ message: 'unable to register' }))
}

module.exports = register;