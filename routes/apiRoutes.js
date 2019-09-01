const db = require('../models');
const path = require('path');
const bcrypt = require('bcrypt');
const uid = require('uid-safe');

module.exports = (app) => {
    app.post('/new/user', (req,res)=>{
        bcrypt.hash(req.body.pass, 8).then((hash)=>{
            db.User.create({userName: req.body.userName, pass: hash}).then(created=>{
                if (created){
                    uid(18).then(newToken=>{
                        db.Token.create({token: newToken, UserId: created.dataValues.id}).then(
                            res.json(newToken)
                        )
                    })
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
        db.User.findOne({where: {userName: req.body.userName.toString()}, include: [db.Token]}).then(pass=>{
            console.log(pass)
            bcrypt.compare(req.body.password, pass.dataValues.pass).then((result)=>{
                if(result){
                    console.log(pass.dataValues.id)
                    uid(18).then(newToken=>{
                        db.Token.update({token: newToken}, {where: {userId: pass.dataValues.id}});
                        res.json(newToken)
                    })
                } else {
                    res.json('Incorrect Password')
                }
            });
            
        })
    })

    app.delete('/delete/:id', (req, res)=>{
        db.User.destroy({where: {id: req.params.id}}).then(deleteUser=>{
            res.json(deleteUser);
        })
    })

    app.get('/user/stats/:id', (req,res)=>{
        db.Character.findOne({where: {UserId: req.params.id}, include: [db.Attack]}).then(stats=>{
            res.json(stats)
        })
    })

    app.get('/token/:token', (req,res)=>{
        console.log('db token')
        db.Token.findOne({where: {token: req.params.token}, include: [db.User]}).then(token=>{
            console.log(token)
            if (token !== null){
                db.Character.findAll({where: {UserId: token.User.id}}).then(char=>{
                    res.json({userId: token.User.id, characters: char})
                })
            } else {
                res.json(false)
            }
        })
    })
    // app.get('user/:id', (req,res)=>{
    //     db.User.findOne({where: {}})
    // })
}