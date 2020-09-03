require('./config/config')

const express = require('express')
const mongoose = require('mongoose');
const path = require('path');
const app = express()

const bodyParser = require('body-parser') 

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(require('./routes/index'))

// hablitar la caperta public
app.use( express.static(path.resolve(__dirname, '../public')));  

mongoose.connect(process.env.URLDB, 
    {   useNewUrlParser: true, 
        useUnifiedTopology:true, 
        useFindAndModify:false,
        useCreateIndex: true
    })
    .then(() => console.log('Conectado a la DB'))
    .catch((e) => console.log(e))

app.listen(process.env.PORT, () => console.log(`Escuchando el puerto ${process.env.PORT}`))