const express = require("express");
const bodyParser = require ("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const telefonos = require("./agenda");


const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

app.get('/api', (req, res) => {
    res.json({ time: Date() });
});

app.get('/error', (req, res, err) => {
    res.status(400).json({error: "Recurso no encontrado"})
})
//Llamar a la lista completa
app.get('/api/telefonos', (req, res) => {
res.json(telefonos);
});

//Llamar por id
app.get('/api/telefonos/:id', (req, res) => {
    const id = Number(req.params.id);
    const result = telefonos.find((telefono) => telefono.id === id) 
        if(!result) {
            res.status(400).json({error: `No se han encontrado registro con el id`});
            return
        } 
        res.json(result);
    });


//Crear un nuevo telefono
app.post('/api/telefonos/nuevo', (req, res) => {

    const nuevoTelefono = req.body;

    if(!nuevoTelefono.id) {
        res.status(400).json({error: "No se mando el id"});
    return;    
    }
    if(!nuevoTelefono.name) {
        res.status(400).json({error: "No se mando el nombre"});
    return;
    }
    if(!nuevoTelefono.number) {
        res.status(400).json({error: "No se mando el numero"});
    return;   
    }

    const validarID = telefonos.find(
        (telefono) => telefono.id === nuevoTelefono.id);

    if(validarID) {
        res.status(400).json({error: "el id esta siendo utilizado"});
        return;
    }

    telefonos.push(nuevoTelefono);
    res.status(200).json(telefonos);
});


const port = process.env.PORT || 8000;
app.listen (port, () => {
    console.log(`El servidor se escucha en el puerto: ${port}`)
});


