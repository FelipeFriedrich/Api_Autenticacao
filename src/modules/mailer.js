const {resolve} = require('path')
const exphbs = require('express-handlebars');
const nodemailer = require ('nodemailer')
const hbs = require('nodemailer-express-handlebars');

const {host, port, user, pass} = require('../config/mail.json');

const transport = nodemailer.createTransport({
    host,
    port,
    auth: {
      user,
      pass
    },
});

const viewPath = resolve(__dirname, '..', 'resources', 'mail');

transport.use('compile', hbs({
  viewEngine: exphbs.create({
    layoutsDir: resolve(viewPath, 'layouts'),
    partialsDir: resolve(viewPath, 'partials'),
    defaultLayout: 'default',
    extname: '.hbs',
  }),
  viewPath,
  extName: '.html',
}));

module.exports = transport;