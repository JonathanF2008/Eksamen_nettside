# eksamen_oppgave
Oppgave til eksamen 10/6.2026


# Hvordan hoste en server med egen proxmox

Last ned ISO fil til Proxmox VE
Bruk rufus for å gjøre den bootable
Boot den opp som egen OS
Følg det som står på skjermen 
Brukernavnet er "root" som standard
Bruk helst Ethernetkabel for å skaffe nettverk


ssh fra mac terminal:

Åpne terminalen på maccen 

Git kloning:

apt update 
apt install git -y 

ssh-keygen -t ed25519 -C "mail til github"

cat ~/.ssh/id_ed25519.pub 

Kopier hele nøkkelen inn i github --> settings --> SSH keys --> New ssh key og kopier den inn (kall den noe du husker)

Tilbake i proxmox skriver du git clone git@github.com:brukernavn/prosjektnavn.git

Siden du nå har kopiert den inn vil du nå kunne pulle derfra ved hjelp av kommandoen git pull

Når du har fått den inn i proxmox går du inn i prosjektet med 
cd prosjektnavn

herfra vil du kjøre følgende kommandoer
apt update (for å sjekke om alt er oppdatert)
apt install nodejs npm -y 


I din js fil "server.js" må du ha følgende med i koden. 

app.listen(3000, "0.0.0.0", () => { 
    console.log("Server kjører på port 3000") 
})

Etter dette kan du skrive 
node server.js 

i mappen du har filen i og den vil kjøre på port 3000. 

Du går i din browser og skriver ip-en til proxmoxen (sjekker med ip a) og skriver http://192.168.xxx.xxx:3000