async function addTodo() {
    const input = document.getElementById("todoInput") /// henter input feltet for todo

    if (!input.value.trim()) return /// hvis det er tomt skal den stoppe funksjonen

    await fetch("/todos", { /// sender data til serveren
        method: "POST", /// viser at denne bare sender data, ikke henter
        headers: { "Content-Type": "application/json" }, /// viser at den sender json data
        body: JSON.stringify({ task: input.value }) /// sender det brukeren skrev
    })

    input.value = "" /// gjør feltet tomt etter  POST
    loadTodos() /// oppdaterer todo listen
}


async function loadTodos() { /// henter todos fra backend (serveren)
    const res = await fetch("/todos") /// get request til serveren 
    const todos = await res.json() /// gjør om dataen til json format

    const list = document.getElementById("TodoList") /// finner ul i html så det blir en liste
    list.innerHTML = "" /// sletter alt i listen så den ikke blir dobbelt opp

    todos.forEach(todo => { /// går gjennom todos og lager en li for hver todo
        const li = document.createElement("li") /// nytt liste element
        li.textContent = todo.task /// setter teksten inn i listen som nettopp ble lagd 
        list.appendChild(li) /// legger til det nye liste elementet i todo listen
    })
}

loadTodos() /// oppdaterer for når siden siden lastes inn




/// lager nytt notat
async function addNote() { 
    const input = document.getElementById("noteInput") /// henter input feltet for notater

    if (!input.value.trim()) return /// stopper hvis feltet er tomt

    /// sender notatet til backend
    await fetch("/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },/// som en json fil
        body: JSON.stringify({ text: input.value }) 
    })

    input.value = "" /// tømmer feltet til neste notat
    loadNotes() /// oppdaterer notat listen
}


/// henter notater fra backend
async function loadNotes() {
    const res = await fetch("/notes")
    const notes = await res.json() /// gjør om dataen til json format

    const list = document.getElementById("noteList")
    list.innerHTML = "" /// sletter alt i listen så den ikke blir dobbelt opp

    notes.forEach(note => { /// går gjennom notatene og lager en li for hver notat
        const li = document.createElement("li") /// nytt liste element
        li.textContent = note.text /// setter teksten inn i listen som nettopp ble lagd
        list.appendChild(li)
    })
}

loadNotes()