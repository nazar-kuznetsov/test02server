const router = require('express').Router();
// const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Users = require('../models/users');
const transporter = require('../email/nodemailer');
const { auth, generateJWT } = require('../auth/auth');
const email_option = require('../email/email-reset-password');

/* получить всех пользывателей
======================================================================================= */
router.route('/').get(async (req, res) => {
  return res.json(await Users.find({}, { password: false }));
});

/* создать акаунт
======================================================================================= */
router.route('/register').post(async (req, res) => {
  const { email, name, password } = req.body;

  const find_user = await Users.findOne({ email }).then(user => user);

  if (find_user) return res.json({ sucess: false, message: 'Указанный email уже зарегистрирован' });

  const hashed_password = await bcrypt.hash(password, 10);

  const user = new Users({ email, name, password: hashed_password });

  user.save().then(({ _id, email, name }) => {
    return res.json({
      success: true,
      message: 'Аккаунт создан успешно',
      user: { _id, email, name }
    });
  }).catch(({ message }) => {
    return res.status(400).json({ success: false, message });
  });
});

/* войти акаунт
======================================================================================= */
router.route('/login').post(async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });

  if (!user) return res.json({ success: false, message: 'Неверный пароль или email' });

  const correct_password = await bcrypt.compare(password, user.password);

  if (!correct_password) return res.json({ success: false, message: 'Неверный пароль или email' });

  return res.json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
      name: user.name
    },
    token: generateJWT(user)
  });
});

/* повторная авторизация | после успешного входа
======================================================================================= */
router.route('/authorization').get(auth, (req, res) => {
  // console.log(req.user)
  return res.json({ success: true, user: req.user });
});

/* удалить акаунт
======================================================================================= */
router.route('/delete').post(async (req, res) => {
  await Users.findOneAndDelete({ _id: req.body._id }, (err, result) => {

    if (err) {
      return res.json({ success: false, message: 'Ошибка при удаление' });
    }
    return res.json({ success: true, message: 'Акаунт удален успешно', _id: req.body._id });
  });

//  return await Users.findOneAndDelete({ _id: req.body._id }).then(() => {
//     console.log(222)
//     return res.json('OK');
//   });

  // return res.status(200).json('Аккаунт был удален');
});

/* отправить письмо для сброса пароля
======================================================================================= */
router.route('/email-reset-password').post(async (req, res) => {
  const { email } = req.body;

  const user = await Users.findOne({ email });

  if (user === null) {
    return res.json({ success: false, message: 'Email не зарегистрирован' });
  }

  const reset_password_token = crypto.randomBytes(64).toString('hex');

  // время действия сброса пароля ( 60 мин )
  const reset_password_expires = Date.now() + 3600000;

  await Users.findOneAndUpdate({ email }, { $set: { reset_password_token, reset_password_expires } });

  await transporter.sendMail(email_option(email, user.name, reset_password_token), (error, info) => {

    if (error) return res.status(400).json({ success: false, message: error });

    return res.json({
      success: true,
      message: `Информация выслана на Ваш E-mail: ${email} если письма нет во входящих проверьте папку спам`
    });
  });

});

/* проверить разрешение на изменение пароля
======================================================================================= */
router.route('/forgot-password-check-access').post(async (req, res) => {
  const user = await Users.findOne({
    reset_password_token: req.body.token,
    reset_password_expires: { $gt: Date.now() }
  });

  if (user === null) {
    return res.status(401).json({ sucess: false, message: 'Доступ запрещен' });
  }

  return res.json({ sucess: true, message: 'ок' });
});

/* сброс пароля | установить новый пароль
======================================================================================= */
router.route('/reset-password').post(async (req, res) => {
  const { token, password } = req.body;

  const user = await Users.findOne({
    reset_password_token: token,
    reset_password_expires: { $gt: Date.now() }
  });

  if (user === null) {
    return res.status(401).json('Доступ запрещен');
  }

  const hashed_password = await bcrypt.hash(password, 10);

  user.password = hashed_password;

  user.reset_password_token = undefined;
  user.reset_password_expires = undefined;

  return user.save()
    .then(() => res.json({ success: true, message: 'Пароль изменен успешно' }))
    .catch(error => res.status(400).json({ success: false, message: 'Ошибка пароль небыл изменен' }));
});

module.exports = router;
