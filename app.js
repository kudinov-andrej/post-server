const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
app.use(cors());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 минут
    max: 100, // 100 запросов с одного IP
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(limiter);

app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    let transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465, // Протокол шифрования SSL/TLS
        secure: true, // Включение SSL/TLS
        auth: {
            user: 'kudinov.andrej@list.ru', // Ваш электронный адрес
            pass: 'NVjhhYQ5Ng6sqCdymptw', // Ваш пароль для внешнего приложения
        },
    });

    const mailOptions = {
        from: 'kudinov.andrej@list.ru',
        to: 'kudinov.andrej@list.ru',
        subject: 'Новое сообщение',
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:', info.response);
            res.status(200).send('Email sent successfully');
        }
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Приложение слушает на порте ${PORT}`);
});
