const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 3000;
const loginRouter = require('./routes/loginRouter');
const registerRouter = require('./routes/registerRouter');
const customLogoRouter = require('./routes/customLogoRouter');
const forgotPasswordRouter = require('./routes/forgotPasswordRouter');
const resetPasswordRouter = require('./routes/resetPasswordRouter');
const changePasswordRouter = require('./routes/changePasswordRouter');
const profileRouter = require('./routes/profileRouter');


const app = express()
app.use(express.json())
app.use(cors())


app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/customlogo', customLogoRouter);
app.use('/forgotpassword', forgotPasswordRouter);
app.use('/resetpassword', resetPasswordRouter);
app.use('/changepassword', changePasswordRouter);
app.use('/profile', profileRouter);



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`)
})