const experss = require('express');
const fileUpload = require('express-fileupload');
const app = experss();
const Usuario = require('../models/usuario.model');
const Producto = require('../models/producto.model');

const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {
    
    let tipo = req.params.tipo;
    let id = req.params.id;


    if(!req.files){
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        })
    }

    //Validar tipo
    let tiposValidos = ['productos', 'usuarios'];

    if(tiposValidos.indexOf( tipo ) < 0){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Los tipos validos son ' + tiposValidos.join(', ')
            }
        })
    }

    let sampleFile = req.files.archivo;
    let archivo  = sampleFile.name.split('.');
    let extension = archivo[archivo.length -1];

    //Extensiones permitidas
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if( extencionesValidas.indexOf( extension ) < 0){
        return res.status(400).json({
            ok: false,
            err:{
                message: 'Las extensiones permitidas son ' + extencionesValidas.join(', ')
            }
        })
    }

    // Cambiar nombre del archivo
    let nombreArchivo = `${ id }-${ Math.random() * 1000000 }.${ extension }`

    sampleFile.mv(`uploads/${ tipo }/${ nombreArchivo }`, (err) =>{

        if(err) return res.status(500).json({ ok: false, err})
        
        if(tipo === 'productos') imagenProducto(id, res, nombreArchivo)
        else imagenUsuario(id, res, nombreArchivo);
    })

function imagenUsuario(id, res, nombreDelArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        
        if(err){
            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if( !usuarioDB ){
            borraArchivo(nombreArchivo, 'usuarios')
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        borraArchivo(usuarioDB.img, 'usuarios')

        usuarioDB.img = nombreDelArchivo;
        usuarioDB.save((err, usuarioDB) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuario: usuarioDB,
                img: nombreDelArchivo
            })
        })

    })
}

function imagenProducto(id, res, nombreDelArchivo){
    Producto.findById(id, (err, productoDB) => {
        if(err){
            borraArchivo(nombreArchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if( !productoDB ){
            borraArchivo(nombreArchivo, 'productos')
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }

        borraArchivo(productoDB.img, 'productos')

        productoDB.img = nombreDelArchivo;
        productoDB.save((err, productoDB) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                usuario: productoDB,
                img: nombreDelArchivo
            })
        })
    })
}


function borraArchivo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${ tipo }/${ nombreImagen}`);

    if( fs.existsSync(pathImagen) ){
        fs.unlinkSync(pathImagen);
    }

}

})

module.exports = app;
