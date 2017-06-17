const express   = require("express");
const user      = require("../../../../server/controllers/userController");

const app = module.exports = express();

app.get('/', function(req, res) {
    user.getByEmail(req.query.email, (err, data) => {
       if (err)
           return res.status(500).send(err.message);
        return (data) ?
            res.status(200).json(data) :
            res.status(200).send({error : 'Пользователь не найден'}); 
    });
});

app.post('/', function(req, res) {
    user.getByEmail(req.query.email, (err, data) => {
        if (err)
            return res.status(500).send(err.message);
        if (!data){
            user.create(req.body, (err, data) => {
                return (err) ? res.status(500).send(err.message) :
                    res.status(200).json(data);
            })
        }else{
            return res.status(200).json(data);
        }
    });
});

app.put('/:id', function(req, res) {
    user.updateBalance(req.params.id, req.body.sum, (err, data) => {
        return (err) ?
            res.status(500).send(err.message) : (data) ?
                res.status(200).json(data) :
                res.status(404).json('Пользователь не найден');
    })
});