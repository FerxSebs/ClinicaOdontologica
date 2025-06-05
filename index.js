//importar el modulo express, que es un framework para construir aplicaciones web en Node.js
import express from 'express';
//llamamos el archivo que se encuentra en la carpeta de rutas
import router from './routes/index.js';
import db from './config/db.js';
import session from 'express-session';
import './models/index.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Conectar a la base de datos
try {
    await db.authenticate();
    await db.sync();
    console.log('Conexión correcta a la Base de Datos');
} catch (error) {
    console.log(error);
}

// Configuraciones
app.set('view engine', 'pug');
app.set('views', './views');

// Middlewares
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Configurar archivos estáticos con ruta absoluta
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de sesiones
app.use(session({
    secret: 'mi_secreto',
    resave: false,
    saveUninitialized: false
}));

// Middleware global
app.use((req, res, next) => {
    res.locals.usuario = req.session.usuario || null;
    res.locals.nombreSitio = "Clínica Dental";
    res.locals.year = new Date().getFullYear();
    next();
});

// Agregar router
app.use('/', router);

// Manejo de errores 404
app.use((req, res) => {
    res.status(404).render('404', {
        pagina: 'Página no encontrada'
    });
});

// Manejo de errores generales
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).render('error', {
        pagina: 'Error',
        mensaje: 'Ha ocurrido un error'
    });
});

//define el puerto en el que la aplicación escuchará las solicitudes
//usa el valor definido en la variable de entorno PORT
// o el puerto 3000 si no está definida (puerto por defecto)
app.listen(port, () => {
    console.log(`El servidor está funcionando en el puerto ${port}`);
});














