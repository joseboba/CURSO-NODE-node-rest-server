const express = require('express');
const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
let Producto = require('../models/producto.model');


app.post('/producto', verificaToken, (req, res) => {

    let {nombre, precioUni, descripcion, categoria} = req.body;
    
    let producto = new Producto({
        nombre,
        precioUni,
        descripcion,
        categoria,
        usuario: req.usuario._id
    })

    producto.save((err, productoDB) => {
        if(err){
            res.status(500).json({
                ok: false,
                err
            })
        }

        res.json({
            productoDB
        })

    })
})

app.put('/producto/:id', verificaToken, (req,res) => {

    const id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, productoDB) =>{
        if(err){
            res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB){
            res.status(404).json({
                ok: false,
                err:{
                    message: 'No hay coincidencias de ID'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })

    })

})

app.delete('/producto/:id', verificaToken, (req, res) => {

    const id = req.params.id;

    Producto.findByIdAndUpdate(id, {disponible: false}, {new: true, runValidators: true}, (err, productoDB) =>{
        if(err){
            res.status(500).json({
                ok: false,
                err
            })
        }

        if(!productoDB){
            res.status(404).json({
                ok: false,
                err:{
                    message: 'No hay coincidencias de ID'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })

})

app.get('/producto', verificaToken, (req, res) => {

    let limite = Number(req.query.limite) || 5 

    Producto.find({ disponible: true })
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre, email')
        .exec((err, productoDB) => {
            if(err){
                console.log(err)
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            if(!productoDB){
                res.status(404).json({
                    ok: false,
                    err:{
                        message: 'No hay coincidencias de ID'
                    }
                })
            }


            Producto.countDocuments({disponible: true}, (err, conteo) => {
                res.json({
                    ok: true,
                    producto: productoDB,
                    conteo
                })
            })
        })

})

app.get('/producto/:id', verificaToken, (req, res) => {

    const id = req.params.id;

    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if(err){
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            if(!productoDB){
                res.status(404).json({
                    ok: false,
                    err:{
                        message: 'No hay coincidencias de ID'
                    }
                })
            }
    
            res.json({
                ok: true,
                producto: productoDB
            })
        })

})

app.get('/buscar/producto', verificaToken, (req, res) => {

    let  {termino}  = req.body;

    Producto.find({ nombre:{$regex: termino, $options: 'i'}, disponible: true })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if(err){
                console.log(err)
                res.status(500).json({
                    ok: false,
                    err
                })
            }

            if(!productoDB){
                res.status(404).json({
                    ok: false,
                    err:{
                        message: 'No hay coincidencias de ID'
                    }
                })
            }
            Producto.countDocuments({disponible: true}, (err, conteo) => {
                res.json({
                    ok: true,
                    producto: productoDB,
                    conteo
                })
            })
        })

})


module.exports = app;