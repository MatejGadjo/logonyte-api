const db = require('../configs/db.config');

const profile = async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await db.select('*').from('users').where({ id: id })

    if (user.length) {
      res.json(user[0])
    } else {
      res.status(400).json('Not found')
    }
  }
  catch (error) {
    res.status(400).json('error getting user')
  }

}

module.exports = profile;