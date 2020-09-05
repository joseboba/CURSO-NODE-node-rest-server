const express = require('express');

const app = express();

app.use(require('./usuario.routes'));
app.use(require('./login.routes'));
app.use(require('./categorias.routes'))
app.use(require('./producto.routes'));
app.use(require('./upload.routes'));
app.use(require('../routes/imagenes.routes'))

module.exports = app;