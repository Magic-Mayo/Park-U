const db = require('../models');
const path = require('path');

module.exports = (app) => {
    app.post('/new/user', (req,res)=>{
        db.User.create(req.body.user);
    })

    app.post('/new/word', (req,res)=>{
        bcrypt.hash(req.body.pass, 8, (err, hash)=>{
            db.Word.create(hash);
        }).catch(err)
    })

    app.post('/new/char/:user', (req, res)=>{
        const user = req.params.user;
        db.Character.create(req.body)
    })
}