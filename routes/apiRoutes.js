const db = require('../models');
const path = require('path');
const bcrypt = require('bcrypt')

module.exports = (app) => {
    app.post('/new/user', (req,res)=>{
        console.log(req.body)
        bcrypt.hash(req.body.newWord, 8).then((hash)=>{
            db.User.create({userName: req.body.newUser, pass: hash}).then(created=>{
                if (created){
                    res.json(true)
                } else {
                    res.json(false)
                }
            })
        })
    })

    app.post('/new/char/:user', (req, res)=>{
        const user = req.params.user;
        db.Character.create(req.body)
    })

    app.get('/word/verify', (req,res)=>{
        db.Users.findOne({where: {userName: req.body.user}}).then(pass=>{
            bcrypt.compare(req.body.pass, hash)
        })
    })

    app.delete('/delete/:id', (req, res)=>{
        db.Users.destroy({where: {id: req.params.id}}).then(deleteUser=>{
            res.json(deleteUser);
        })
    })
}