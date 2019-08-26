const db = require('../models');
const path = require('path');

module.exports = (app) => {
    app.post('/new/user', (req,res)=>{
        db.User.create()
    })

    app.post('/new/word', (req,res)=>{
        db.Word.create()
    })

    app.post('/new/char/:user', (req, res)=>{
        const user = req.params.user;
        db.Character.create()
    })
}