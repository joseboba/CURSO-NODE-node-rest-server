const express = require('express');
const { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion')
const app = express();
let Categoria = require('../models/categoria.model');



app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {

        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })


    })

})

app.put('/categoria/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;

    

    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true, context: 'query'}, (err, categoriaDB) =>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })
})

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) =>{

    const id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) =>{ 
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
    
        if(!categoriaDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message: 'El ID no fue encontrado'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB,
            message: 'Categoria Borrada'
        })
    })

})

app.get('/categoria/:id', verificaToken, (req, res) =>{
    
})

app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort({descripcion: 1})
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok: true,
                categorias
            })

        })
})
module.exports = app;