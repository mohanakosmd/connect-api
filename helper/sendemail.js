var sgMail = require('@sendgrid/mail');
const config = require('../config/config');
sgMail.setApiKey(config.sendgrid.sendgridApiKey);
module.exports = sgMail;