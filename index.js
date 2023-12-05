const express = require('express')
const app = express()
const morgan = require('morgan')

const cors = require('cors')
app.use(cors())

app.use(express.json())
app.use(express.static('dist'))

morgan.token('body', function (req) { return JSON.stringify(req.body) })


app.use(morgan(':method :url :status :res[content-length] - :response-time ms Body: :body'))


let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: 2,
        name: "Ada LoveLace",
        number: "21321421412"
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "123214312421"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number: "1321421421"
    }
]

app.get('/info', (req, res) => {
    const currentTime = new Date()
    res.send(`<p>The phonebook has the info of ${persons.length} people</p><p>${currentTime}</p>`)
})

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.post('/api/persons', (request, response) => {
    const person = request.body
    person.id = Math.floor(Math.random() * 10000)

    if (!person.name || !person.number) {
        return response.status(400).json({
            error: 'Name or number missing"'
        })
    } else if (persons.some(p => p.name === person.name)){
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }

    persons = persons.concat(person)
    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const number = persons.find(person => person.id === id)
    if (number) {
        response.json(number)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})