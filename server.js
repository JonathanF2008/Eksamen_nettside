const express = require("express") /// node.js bibleotek for å lage servere
const fs = require("fs") /// lar deg lese filer på pc (brukes med json) 
const { exec } = require("child_process") /// lar deg kjøre terminal kommando (git pull) 

const app = express() /// lager server app
app.use(express.json()) /// klarer å lese json filer som kommer inn i request body
app.use(express.static("public")) /// forteller serveren at den skal bruke filer fra public mappen


/// dette er mine json filer som lagrer data til brukeren
const TODO_FILE = "data.json" 
const PROBLEM_FILE = "problemer.json"
const NOTES_FILE = "notes.json"

/// denne leser filer 
function readJSON(file) {
    try {
        if (!fs.existsSync(file)) return [] /// lager en [] hvis filen ikke finnes (fortsatt tom men finnes)
        const data = fs.readFileSync(file, "utf8") /// leser filen som tekst 
        if (data) {
    return JSON.parse(data)
} else {
    return []
}
    } catch { ///returnerer tom liste som hindrer kræsj og feilkommunikasjon
        return []
    }
}


/// brukes for å lagre data
function writeJSON(file, data) { 
    fs.writeFileSync(file, JSON.stringify(data, null, 2)) /// gjør json til js også til tekst og skriver til en fil
}


/// TODO
app.get("/todos", (req, res) => { /// frontend spør om todo
    res.json(readJSON(TODO_FILE)) /// sender tilbake json data fra TODO_FILE
})

app.post("/todos", (req, res) => {
    const todos = readJSON(TODO_FILE)  /// henter gamle TODOs

    todos.push({ /// det brukeren skriver blir pusha inn i TODO filen
        task: req.body.task,
        done: false /// todo er ikke ferdig ennå
    })

    writeJSON(TODO_FILE, todos) /// skriver nye oppdaterte todos i filen

    res.json({ message: "Todo lagret" }) /// frontend får vite at dette er gjort
})

// Notater
app.get("/notes", (req, res) => {
    res.json(readJSON(NOTES_FILE)) /// sender tilbake json data fra NOTES_FILE
})

app.post("/notes", (req, res) => {
    const notes = readJSON(NOTES_FILE)

    notes.push({
        text: req.body.text
    })

    writeJSON(NOTES_FILE, notes)

    res.json({ message: "Notat lagret" }) /// frontend får vite at dette er gjort
})

// Problemer
app.post("/problemer", (req, res) => {
    const problemer = readJSON(PROBLEM_FILE)

    problemer.push({
        text: req.body.text, 
        time: new Date().toISOString() 
    })

    writeJSON(PROBLEM_FILE, problemer)

    res.json({ message: "Problem rapportert" }) /// frontend får vite at dette er gjort
})


app.post("/refresh", (req, res) => {
    exec("git pull", (error, stdout, stderr) => { 
        if (error) {
            return res.json({ error: stderr }) 
        }
        res.json({ message: stdout }) 
    })
})


app.listen(3000, "0.0.0.0", () => { 
    console.log("Server kjører på port 3000") 
})