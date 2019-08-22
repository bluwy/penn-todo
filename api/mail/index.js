import nm from 'nodemailer'

// Create transport using test account from https://ethereal.email/create
// I am Cristian Reinger. Mwahaha..

const transporter = nm.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false,
  auth: {
    user: 'cristian88@ethereal.email',
    pass: 'EJ6Bs13ReBV4JT212G'
  }
})

export default {
  /**
   * Send email
   * @param {nm.SendMailOptions} options Mail options
   */
  sendMail (options) {
    return transporter.sendMail(options)
  },
  /**
   * Get test message URL for Ethereal test accounts
   * @param {nm.SentMessageInfo} info Mail info
   */
  getTestMessageUrl (info) {
    return nm.getTestMessageUrl(info)
  }
}
