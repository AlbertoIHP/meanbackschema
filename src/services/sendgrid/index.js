import sendgrid, { mail as helper } from 'sendgrid'
import { sendgridKey, defaultEmail } from '../../config'

import nodemailer from 'nodemailer'


export const sendMail = ({
  fromEmail = defaultEmail,
  toEmail,
  subject,
  content,
  contentType = 'text/html'
}) => {
  fromEmail = new helper.Email(fromEmail)
  toEmail = new helper.Email(toEmail)
  content = new helper.Content(contentType, content)
  const mail = new helper.Mail(fromEmail, subject, toEmail, content)



  const sg = sendgrid(sendgridKey)

  
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  })



  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  nodemailer.createTestAccount((err, account) => {

      console.log(toEmail)

      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
              user: fromEmail.email, // generated ethereal user
              pass: 'conectikids123' // generated ethereal password
          }
      });

      console.log(content)

      // setup email data with unicode symbols
      let mailOptions = {
          from: fromEmail.email, // sender address
          to: toEmail.email, // list of receivers
          subject: 'Recuperacion de contraseña', // Subject line
          html: content.value // html body
      };

      // send mail with defined transport object
      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message sent: %s', info.messageId);
          // Preview only available when sending through an Ethereal account
          console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      });
  });



  //return sg.API(request)

  let response = { statusCode: 200}

  return response
}
