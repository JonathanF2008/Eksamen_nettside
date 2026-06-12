const express = require("express") /// node.js bibleotek for å lage servere
const fs = require("fs") /// lar deg lese filer på pc (brukes med json) 
const { exec } = require("child_process") /// lar deg kjøre terminal kommando (git pull) 

const app = express() /// lager server app
app.use(express.json()) /// klarer å lese json filer som kommer inn i request body
app.use(express.static("public")) /// forteller serveren at den skal bruke filer fra public mappen


// IP logging
app.use((req, res, next) => {
    const ip =
        req.headers["x-forwarded-for"]?.split(",")[0] ||
        req.socket.remoteAddress;

    const log = {
        ip,
        time: new Date().toISOString(),
        url: req.url
    };

    let logs = [];

    try {
        if (fs.existsSync("./iplogs.json")) {
            logs = JSON.parse(fs.readFileSync("./iplogs.json", "utf8"));
        }
    } catch (err) {
        logs = [];
    }

    logs.push(log);

    fs.writeFileSync("./iplogs.json", JSON.stringify(logs, null, 2));

    next();
});


/// dette er mine json filer som lagrer data til brukeren
const TODO_FILE = "todo.json" 
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
    } catch {
        return []
    }
}


/// brukes for å lagre data
function writeJSON(file, data) { 
    fs.writeFileSync(file, JSON.stringify(data, null, 2))
}


/// TODO
app.get("/todos", (req, res) => {
    res.json(readJSON(TODO_FILE))
})

app.post("/todos", (req, res) => {
    const todos = readJSON(TODO_FILE)

    todos.push({
        task: req.body.task,
        done: false
    })

    writeJSON(TODO_FILE, todos)

    res.json({ message: "Todo lagret" })
})

// Notater
app.get("/notes", (req, res) => {
    res.json(readJSON(NOTES_FILE))
})

app.post("/notes", (req, res) => {
    const notes = readJSON(NOTES_FILE)

    notes.push({
        text: req.body.text
    })

    writeJSON(NOTES_FILE, notes)

    res.json({ message: "Notat lagret" })
})

// Problemer
app.post("/problemer", (req, res) => {
    const problemer = readJSON(PROBLEM_FILE)

    problemer.push({
        text: req.body.text, 
        time: new Date().toISOString() 
    })

    writeJSON(PROBLEM_FILE, problemer)

    res.json({ message: "Problem rapportert" })
})


app.post("/refresh", (req, res) => {
    exec("cd /root/Eksamen_nettside && git pull", (error, stdout, stderr) => { 
        if (error) {
            return res.json({ error: stderr }) 
        }
        res.json({ message: stdout }) 
    })
})


app.listen(3000, "0.0.0.0", () => { 
    console.log("Server kjører på port 3000") 
})