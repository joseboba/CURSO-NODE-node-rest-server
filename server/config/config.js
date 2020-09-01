// ===================
//      Puerto
// ===================
process.env.PORT = process.env.PORT || 3000; 


// ===================
//      Entorno
// ===================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// =====================
//      BAse de Datos
// =====================
let urlDB;
if(process.env.NODE_ENV === 'dev') 
    urlDB = 'mongodb://localhost:27017/cafe' 
else
    urlDB = 'mongodb+srv://jebo:IDPBrcX5S6GOEA9L@cluster0.gfyga.mongodb.net/cafe'

process.env.URLDB = urlDB