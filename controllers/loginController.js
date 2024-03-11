const db = require('../configs/db.config');
const bcrypt = require('bcrypt');

const login = (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      bcrypt.compare(req.body.password, data[0].hash)
        .then((isValid) => {
          if (isValid) {
            return db.select("*").from("users")
              .where('email', '=', req.body.email)
              .then(user => {
                res.json(user[0])
              })
              .catch(err => res.status(400).json('unable to get user'))
          } else {
            res.status(400).json('wrong credentials')
          }
        })
    })

    .catch(err => res.status(400).json("wrong credentials"))
}

module.exports = login;



// ASYNC AWAIT HERE 

/* #################################################
#################################################### */

// const login3 = async (req, res) => {
//   try {
//     const data = await db.select('email', 'hash').from('login')
//       .where('email', '=', req.body.email)

//     const isValid = await bcrypt.compare(req.body.password, data[0].hash)

//     if (isValid) {
//       // return db.select("*").from("users")
//       //   .where('email', '=', req.body.email)
//       //   .then(user => {
//       //     res.json(user[0])
//       //   })
//       //   .catch(err => res.status(400).json('unable to get user'))
//       try {
//         const user = await db.select("*").from("users")
//           .where('email', '=', req.body.email)
//         res.json(user[0])
//         return user;
//       }
//       catch (error) {
//         res.status(400).json('unable to get user')
//       }
//     } else {
//       res.status(400).json('wrong credentials')
//     }

//   }
//   catch (error) {
//     res.status(400).json("wrong credentials")
//   }
// }