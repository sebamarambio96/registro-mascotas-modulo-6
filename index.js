const express = require('express')
const app = express()
const fs = require('fs')
const cors = require('cors')

app.use(express.static('public'))
app.use(cors())

app.get('/', (req, res) => {
    res.sendFile("index.html")
} )

//Retorna TODAS las mascotas
app.get('/all', (req, res) => {
    let data = fs.readFileSync('./data/mascotas.json')
    let pets = JSON.parse(data)
    res.json(pets)
})

//Retorna la mascota según su NOMBRE
app.get('/searchPetName/:name', (req, res) => {
    let data = fs.readFileSync('./data/mascotas.json')
    let pets = JSON.parse(data).pets
    const petFound = pets.find(pet => pet.name === req.params.name)
    //si no existe ponemos un status(404)
    !petFound && res.status(404).json({ message: 'pet not found' })
    res.json(petFound)

})

//Retorna todas mascotas con el RUT del dueño
app.get('/searchPetRut/:rut', (req, res) => {
    let data = fs.readFileSync('./data/mascotas.json')
    let pets = JSON.parse(data).pets
    const petOwner = pets.filter(pet => pet.rut === req.params.rut)
    //si no existe ponemos un status(404)
    !petOwner && res.status(404).json({ message: 'pet not found' })
    res.json(petOwner)
})

//Inserta una NUEVA mascota
app.post('/insertPet/:newPet', (req, res) => {
    //http://localhost:3001/insertPet/newPet?name=Jose&rut=33333333-3 ejemplo
    // console.log(req.query)
    let data = fs.readFileSync('./data/mascotas.json')
    let pets = JSON.parse(data)
    console.log(pets)
    pets.pets.push(req.query)
    fs.writeFileSync('./data/mascotas.json', JSON.stringify(pets))
    res.send(pets)
})

//ELIMINAR MASCOTA por nombre 💀
app.delete('/deletePetName/:namePet', (req, res) => {
    //http://localhost:3001/deletePetName/Benji ejemplo
    let data = fs.readFileSync('./data/mascotas.json')
    let pets = JSON.parse(data)
    const petFound = pets.pets.find(pet => pet.name === req.params.namePet)
    if (!petFound) {
        res.status(404).json({ message: 'pet not found' })
    } else {
        pets = pets.pets.filter(pet => pet.name !== req.params.namePet)
        console.log(pets)
        //podemos enviar un codigo de estatus
        fs.writeFileSync('./data/mascotas.json', `{"pets": ${JSON.stringify(pets)}}`)
        res.sendStatus(204)
    }
})

//ELIMINAR MASCOTAS asociadas al rut del dueño 
app.delete('/deletePetRut/:ownerRut', (req, res) => {
    //http://localhost:3001/deletePetRut/11111111-1 ejemplo
    let data = fs.readFileSync('./data/mascotas.json')
    let pets = JSON.parse(data)
    const petFound = pets.pets.find(pet => pet.rut === req.params.ownerRut)
    if (!petFound) {
        res.status(404).json({ message: 'owner not found' })
    } else {
        pets = pets.pets.filter(pet => pet.rut !== req.params.ownerRut)
    console.log(pets)
    //podemos enviar un codigo de estatus
    fs.writeFileSync('./data/mascotas.json', `{"pets": ${JSON.stringify(pets)}}`)
    res.sendStatus(204)
    }
})

app.listen(3001)
console.log(`Server on port 3001`)