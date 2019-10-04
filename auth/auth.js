const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config');

module.exports = {
    auth: (req, res, next) => {
        const authorization = req.headers.authorization;
        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            try {
                const token = authorization.split(' ')[1];
                const decoded = jwt.verify(token, SECRET_KEY);
                req.user = decoded;
                next();
            } catch (error) {
                return res.status(400).send({ success: false, message: error });
            }
        } else {
            return res.status(400).json({ success: false, message: 'Доступ запрещен' });
        }
    },
    generateJWT: ({ _id, email, name }) => {
        return jwt.sign({ _id, email, name }, SECRET_KEY, { expiresIn: '24h' });
    }
};
