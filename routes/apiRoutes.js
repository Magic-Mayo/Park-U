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

        db.Character.create({charName: req.body.name, class: req.body.class, defense: def, maxHP: HP, currentHP: HP, UserId: user, luck: req.body.luckyNum, AttackId: atk})
    })

    app.post('/word/verify', (req,res)=>{
        db.User.findOne({where: {userName: req.body.userName.toString()}, include: [db.Token]}).then(pass=>{
            // console.log(pass)
            bcrypt.compare(req.body.password, pass.dataValues.pass).then((result)=>{
                if(result){
                    console.log(pass.dataValues.id)
                    uid(18).then(newToken=>{
                        db.Token.update({token: newToken}, {where: {userId: pass.dataValues.id}});
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
        console.log(req.params.id)
        db.Character.findOne({where: {id: req.params.id}, include: [db.Attack]}).then(stats=>{
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