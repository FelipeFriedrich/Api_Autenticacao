const { Router } = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const authConfig = require ('../../config/auth');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const router = Router();


function generateToken(params = {}){
    return jwt.sign(params, authConfig.secret,{
        expiresIn: 86400,
    });
}


router.post('/register', async (req, res) =>{
    const {email} = req.body;    
    try{
        if (await User.findOne({email}))
        return res.status(400).send('User have register;')
        
        const user = await User.create(req.body);
        user.password = undefined;
        return res.status(201).send({
            user,
            token: generateToken({id: user.id}),
      });
    }catch (err){
        return res.status(400).send({error: 'Registration failed'});
    }
});

router.post('/authenticate', async(req, res) => {
    const {email, password} = req.body;

    const user = await User.findOne({email}).select('+password');
    if(!user)
        return res.status(400).send({error: 'User not found'});

    if (!await bcrypt.compare(password, user.password))
        return res.status(400).send({error: 'Invalid password'});
    
    user.password = undefined;


    res.send({
        user,
        token: generateToken({id: user.id}),
    });
});

router.post('/forgot_password', async(req,res) =>{
    const {email} = req.body;

    try{
        const user = await User.findOne({email});
        console.log('chegou aqui');
        if(!user)
            return res.status(400).send({error: 'User not found'});
        
        console.log('chegou aqui2');
        const token = crypto.randomBytes(20).toString('hex');
        const now = new Date();
        now.setHours(now.getHours() + 1);
        console.log('chegou aqui3');
        await User.findByIdAndUpdate(User.id, {
            '$set':{
                passwordResetToken: token,
                passwordResetExpires: now,
            }
        });
        console.log('chegou aqui4');
        mailer.sendMail({
            to: email,
            from: 'felipe.friedrich@compasso.com.br',
            template: 'auth/forgot_password',
            context: {token},
        
        }, (err) => {
            if (err)
            console.log(err);
            res.status(400).send({error: 'Cannot send forgot password email.'})

            return res.send();
    
        });

    }catch(err){
        console.log(err);
        res.status(400).send({error: 'Erro on forgot password, try again!'})
    }
})

module.exports = app => app.use('/auth', router);