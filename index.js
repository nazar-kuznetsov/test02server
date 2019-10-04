const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const users_router = require('./routes/users-router');
const upload_router = require('./routes/upload-router');
const about_router = require('./routes/about-router');
const { MONGO_URI } = require('./config');
const path = require('path');

const PORT = process.env.PORT || 5500;
const app = express();

app.use(cors()); // на продакшене убрать
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.set('useFindAndModify', false);
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

app.use('/api/user', users_router);
app.use('/api/upload', upload_router);
app.use('/api/about', about_router);

app.use('*/upload', express.static('upload'));

 // Админ Панель
app.use('/admin/', express.static(path.join(__dirname, 'admin')))

app.get('/admin/*', function (req, res) {
 res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});

// Главный сайт
app.use('/', express.static(path.join(__dirname, 'front-end')))

app.get('/*', function (req, res) {
 res.sendFile(path.join(__dirname, 'front-end', 'index.html'));
});


// app.listen(PORT, () => console.log(`Сервер запущен порт: ${PORT}`));

app.listen(PORT, '0.0.0.0', function() {
    console.log(`Сервер запущен порт: ${PORT}`);
});

db.once('open', () => console.log('Подключение к базе данных успешно'));

