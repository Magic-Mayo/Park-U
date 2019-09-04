const db = require('../models');
const path = require('path');
const bcrypt = require('bcrypt');
const uid = require('uid-safe');
const moment = require('moment')

module.exports = (app) => {
    app.post('/new/user', (req,res)=>{
        db.User.findOrCreate({where: {userName: req.body.userName}}).then(([user, created])=>{
            if (created){
                bcrypt.hash(req.body.pass, 8).then(hash=>{
                    uid(18).then(newToken=>{
                        db.Token.create({token: newToken, UserId: user.dataValues.id}).then(
                            db.User.update({pass: hash}, {where: {userName: req.body.userName}}).then(
                                res.json({token: newToken, uid: user.dataValues.id, userName: user.dataValues.userName})
                        ))
                    })
                })
            } else {
                    res.json(false)
            }
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
            case 'Javascript': def = 5; break;
        }
        switch (req.body.class){
            case 'CSS': HP = 125; break;
            case 'HTML': HP = 100; break;
            case 'Javascript': HP = 115; break;
        }
        switch (req.body.class){
            case 'CSS': atk = 1; break;
            case 'HTML': atk = 2; break;
            case 'Javascript': atk = 3; break;
        }
        console.log(user)
        db.Character.create({charName: req.body.name, class: req.body.class, defense: def, maxHP: HP, currentHP: HP, UserId: user, luck: req.body.luckyNum, AttackId: atk}).then(created=>{
            res.json(created.id)
        })
    })

    app.post('/word/verify', (req,res)=>{
        db.User.findOne({where: {userName: req.body.userName.toString()}, include: [db.Token]}).then(pass=>{
            if(pass && !pass.dataValues.locked){
                let invalid = pass.dataValues.invalidAttempt;
                bcrypt.compare(req.body.password, pass.dataValues.pass).then((result)=>{
                    if(result){
                        uid(18).then(newToken=>{
                            db.Token.create({token: newToken, UserId: pass.dataValues.id});
                            db.Character.findAll({where: {UserId: pass.dataValues.id}}).then(char=>{
                                res.json({token: newToken, character: char, uid: pass.dataValues.id})
                            })
                        })
                    } else {
                        if (invalid < 5 && invalid === null){
                            db.User.update({invalidAttempt: 1}, {where: {userName: pass.dataValues.userName}}).then(
                                res.json({valid: false, msg: `Invalid Password!  You only have ${4} more attempts until your account is locked!`})
                                )
                        } else if(invalid < 5) {
                            db.User.update({invalidAttempt: invalid+1}, {where: {userName: pass.dataValues.userName}}).then(
                                res.json({valid: false, msg: `Invalid Password!  You only have ${5-pass.dataValues.invalidAttempt} more attempts until your account is locked!`})
                            )
                        } else {
                            db.User.update({locked: true}, {where: {userName: pass.dataValues.userName}}).then()
                                res.json({locked: true, valid: false, msg: 'Your account has been locked after too many failed log-in attempts!  Please reset your password!'})
                        }
                    }
                    
                });
            } else if (pass && pass.dataValues.locked) {
                res.json({valid: false, msg: 'Your account has been locked after too many failed log-in attempts!  Please reset your password!'})            
            } else {
                res.json({valid: false, msg: 'Please make sure you entered a valid user name and password!'})
            }            
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

    app.post('/token/', (req,res)=>{
        db.Token.findOne({where: {token: req.body.token}, include: [db.User]}).then(token=>{
            if (token !== null){
                if (moment().diff(token.createdAt, 'days', true)<30){
                    db.Character.findAll({where: {UserId: token.User.dataValues.id}}).then(char=>{
                        res.json({userId: token.User.id, characters: char, userName: token.User.userName})
                    })
                } else {
                    db.Token.destroy({where: {token: req.body.token}}).then(
                        res.json(false)
                    )
                }
            } else {
                res.json(false)
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

    app.get('/start/id=:id/:compId', (req,res)=>{
        const id = req.params.id;
        const compId = req.params.compId;

        
    })
}