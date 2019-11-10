const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
         user: process.env.GMAIL_USER,
         pass: process.env.GMAIL_PASS
     }
 });

const sendMail = async (to, subject, html) => {
  return new Promise((resolve, reject) => {
    try {
      const mailOptions = {
        from: 'Monitor eduardo@cloudcom.com.br', // sender address
        to, // list of receivers
        subject, // Subject line
        html// plain text body
      };
      
      transporter.sendMail(mailOptions, function (err, info) {
        if(err)
          reject(err)
        else
          resolve(info);
      });
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  sendMail
}