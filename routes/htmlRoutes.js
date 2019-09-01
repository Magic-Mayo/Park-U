const db = require('../models');
const path = require('path');

module.exports = (app) => {
    app.get('/', (req, res)=>{
        res.sendFile(path.join(__dirname, '../public/login.html'))
    })

    app.get('/start/id=:id', (req,res)=>{
        res.sendFile(path.join(__dirname, '../public/start.html'))
    })
}