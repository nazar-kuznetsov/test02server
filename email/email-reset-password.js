const { SITE_URL, EMAIL_FROM, SITE_NAME } = require('../config');

const body = (name, token) => {
  return ` <div>
        <h2>Восстановление пароля</h2>
        <p>Уважаемый <b>${name}</b>. Вы сделали запрос на получение забытого пароля на сайте
        <a href="${SITE_URL}">${SITE_NAME}</a>
        Что бы получить новый пароля пройдите по ссылке ниже
        </p>
        <a href="${SITE_URL}/admin/reset-password/${token}">Востановить пароль</a>
        <span>время действия ссылки 60 мин</span>
        <p>Если это не вы сделали запрос для получение пароля, то просто проигнорируйте это сообщение</p>
        </div>
    `;
};

module.exports = (email, name, reset_password_token) => {
  return {
    to: email,
    from: EMAIL_FROM,
    subject: 'Восстановление пароля',
    html: body(name, reset_password_token)
  };
};


