const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const { SENDGRID_API_KEY } = require('../config');

// module.exports = nodemailer.createTransport(sendgrid({
//     auth: { api_key: SENDGRID_API_KEY }
// }));

module.exports = nodemailer.createTransport({
    service: 'Gmail',
    port: 587,
    secure: false,
    auth: {
        user: 'kador.tech@gmail.com',
        pass: '1234qwedsazxC'
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
    }
});
