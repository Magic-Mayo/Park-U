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

    app.post('/word/verify', (req,res)=>{
        console.log(req.body)
        db.User.findOne({where: {userName: req.body.user.toString()}}).then(pass=>{
            console.log(pass.dataValues.pass)
            bcrypt.compare(req.body.userPass, pass.dataValues.pass).then((result)=>{
                if(result){
                    res.json(result)
                } else {
                    res.json(false)
                }
            })
        })
    })

    app.delete('/delete/:id', (req, res)=>{
        db.User.destroy({where: {id: req.params.id}}).then(deleteUser=>{
            res.json(deleteUser);
        })
    })

    app.get('/user/stats/:id', (req,res)=>{
        console.log(req.params.id)
        db.Character.findOne({where: {UserId: req.params.id}, include: [db.Attack]}).then(stats=>{
            res.json(stats)
        })
    })
}