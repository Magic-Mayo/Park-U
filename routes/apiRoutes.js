const db = require('../models');
const path = require('path');
const bcrypt = require('bcrypt');
const uid = require('uid-safe');
const moment = require('moment')

module.exports = (app) => {
    app.post('/new/user', (req,res)=>{
        bcrypt.hash(req.body.pass, 8).then((hash)=>{
            db.User.findOrCreate({where: {userName: req.body.userName, pass: hash}}).then(([user, created])=>{
                if (created){
                    uid(18).then(newToken=>{
                        db.Token.create({token: newToken, UserId: user.dataValues.id}).then(
                            res.json({token: newToken, uid: user.dataValues.id})
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
        let def;
        let HP;
        let atk;
        switch (req.body.class){
            case 'CSS': def = 3; break;
            case 'HTML': def = 6; break;
            case 'Javascript': def = 5; break
        }
        switch (req.body.class){
            case 'CSS': HP = 125; break;
            case 'HTML': HP = 100; break;
            case 'Javascript': HP = 115; break
        }
        switch (req.body.class){
            case 'CSS': atk = 1; break;
            case 'HTML': atk = 2; break;
            case 'Javascript': atk = 3; break
        }

        db.Character.create({charName: req.body.name, class: req.body.class, defense: def, maxHP: HP, currentHP: HP, UserId: user, luck: req.body.luckyNum, AttackId: atk}).then(created=>{
            res.json(created.id)
        })
    })

    app.post('/word/verify', (req,res)=>{
        db.User.findOne({where: {userName: req.body.userName.toString()}, include: [db.Token]}).then(pass=>{
            bcrypt.compare(req.body.password, pass.dataValues.pass).then((result)=>{
                if(result){
                    uid(18).then(newToken=>{
                        db.Token.create({token: newToken, UserId: pass.dataValues.id});
                        db.Character.findAll({where: {UserId: pass.dataValues.id}}).then(char=>{
                            res.json({token: newToken, character: char, uid: pass.dataValues.id})
                        })
                    })
                } else {
                    res.json(false)
                }
            });
            
        })
    })

    app.delete('/delete/:id', (req, res)=>{
        db.User.destroy({where: {id: req.params.id}}).then(deleteUser=>{
            res.json(deleteUser);
        })
    })

    app.get('/user/char/:id/stats', (req,res)=>{
        db.Character.findOne({where: {id: req.params.id}, include: [db.Attack]}).then(stats=>{
            res.json(stats)
        })
    })

    app.get('/token/:token', (req,res)=>{
        db.Token.findOne({where: {token: req.params.token}, include: [db.User]}).then(token=>{
            if (token !== null){
                if (moment().diff(token.createdAt, 'days', true)<30){
                    db.Character.findAll({where: {UserId: token.User.dataValues.id}}).then(char=>{
                        res.json({userId: token.User.id, characters: char})
                    })
                } else {
                    db.Token.destroy({where: {token: req.params.token}}).then(
                        res.json(false)
                    )
                }
            }
        })
    })
    
    app.get('/user/:name', (req,res)=>{
        db.User.findOne({where: {userName: req.params.name}}).then(user=>{
            if(user){
                res.json(true)
            } else {
                res.json(false)
            }
        })
    })

    // Future dev for saving/leveling up
    app.get('/user/:charId', (req,res)=>{
        db.Character.findOne({where: {id: req.params.charId}, include: [db.User]}).then(user=>{
            db.findOne({where: {id: user.User.dataValues.id}, include: [db.Token]}).then(token=>{
                db.Token.update({where: {}})
            })
        })
    })

    app.patch('/logout/user/', (req,res)=>{
        db.Token.update(null, {where: {token: req.body}}).then(
            res.json(true)
        )
    })

    app.get('/comp/:name/stats', (req,res)=>{
        db.CompCharacter.findOne({where: {charName: req.params.name}, include: [db.Attack]}).then(comp=>{
            res.json(comp)
        })
    })

    app.delete('/logout/user/:token', (req,res)=>{
        db.Token.destroy({where: {token: req.params.token}}).then(
            res.json(true)
        )
    })
}