const Usuario = require('../models/usuario.model')
const bcrypt = require('bcrypt');
const express = require('express');
const _ = require('underscore');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')
const app = express();

app.get('/usuario', verificaToken ,(req, res) => {

    let since = req.query.since || 0
    since = Number(since);

    let limit = req.query.limit || 5
    limit = Number(limit)
    
    Usuario.find({estado: true}, 'nombre email role estado google img')
        .skip(since)
        .limit(limit)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({estado: true}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                })
            })
            
        })

        
})

app.post('/usuario', [verificaToken, verificaAdmin_Role] ,(req, res) => {
    
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    
    usuario.save((err, usuarioDB) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })
})
app.put('/usuario/:id',[verificaToken, verificaAdmin_Role] ,(req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    
    Usuario.findOneAndUpdate(id, body, { new: true, runValidators: true}, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
 
        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })
})
app.delete('/usuario/:id', [verificaToken, verificaAdmin_Role] ,(req, res) => {

    let id = req.params.id;

    let cambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiaEstado , {new: true} ,(err, usuarioBorrado) => {

        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        
        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        })

    })
})

module.exports = app;