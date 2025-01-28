# iZiViD

## Setup

Volg de onderstaande stappen om iZiViD op je lokale machine te installeren en te gebruiken:

### 1. Clone de repository

Open een terminal en voer het volgende commando uit:

```bash
git clone https://github.com/iZiViD/iZiViD.git
```

### 2. Open de projectmap in je code-editor

- Ga naar je favoriete code-editor (zoals Visual Studio Code, WebStorm, etc.).
- Open de folder die je zojuist hebt gekloond.

### 3. Installeer de dependencies en start de applicatie

Navigeer in je terminal naar de projectmap en voer de volgende commando's uit:

```bash
cd iZiViD
npm install
npm run dev
```

### 4. Open localhost in twee tabbladen

Open twee tabbladen in je browser en ga naar:

```
http://localhost:3000/
```

### 5. Gebruik de applicatie

1. **Join een lobby**:

   - Klik op beide tabbladen op de knop **Join Lobby**. Je ziet nu een scherm zoals hieronder:

![image](https://github.com/user-attachments/assets/ce12694d-e8d2-472c-bdb5-14874e6acc45)

2. **My Peer ID invoeren**:

   - Kopieer de **My Peer ID** van het ene tabblad en plak deze in het invoerveld van het andere tabblad. Bijvoorbeeld:
  
![image](https://github.com/user-attachments/assets/79998ab5-8b0c-49b9-a454-15c74a7f1487)

3. **Maak een verbinding**:

   - Klik op **Connect**. Je hebt nu een peer-to-peer-verbinding.


4. **Chatten**:

   - Je kunt nu berichten naar elkaar sturen.

     ![image](https://github.com/user-attachments/assets/1b12cd00-8382-4624-bb39-54329d35ed3d)


### 6. Start een call

- **2 lose coneties via port in vscode** als je een port maakt met de locale host kan je het ook testen met iemand ander.
- **Camera starten**: Zorg ervoor dat de camera op beide tabbladen is gestart.
- **Call starten**: Scroll naar beneden en klik op **Start Call**.

> **Opmerking:** Schermdelen werkt momenteel niet in de peer-to-peer-verbinding. Filters werken alleen voor één gebruiker.
