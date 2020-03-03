const { Router } = require('express');
const middlewareAuth = require('../middlewares/auth');

const router = Router();

router.use(middlewareAuth);
router.get('/', (req,res) => {
    res.send({ ok: true, user: req.userId});
});

module.exports = app => app.use('/projects', router)