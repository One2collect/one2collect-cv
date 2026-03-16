# CV Upload App

Eenvoudige Node.js app waarmee bezoekers hun CV kunnen uploaden via een formulier. Het CV wordt als bijlage naar jouw e-mailadres verstuurd.

## Wat zit erin?
- Publieke uploadpagina
- API endpoint: `POST /upload-cv`
- Bestand upload met validatie
- E-mailverzending via SMTP
- Gezondheidscheck endpoint: `GET /health`

## Installatie
```bash
npm install
cp .env.example .env
```

Vul daarna je SMTP-gegevens in in `.env`.

## Starten
```bash
npm start
```

Lokaal draait de app dan op:
- `http://localhost:3000`

## Publieke link maken
Zet deze app op bijvoorbeeld:
- Render
- Railway
- VPS / hosting met Node.js

Na deploy krijg je een publieke link zoals:
- `https://jouwdomein.nl`
- of `https://cv-upload-app.onrender.com`

## Gmail tip
Gebruik voor Gmail een **app-wachtwoord**, niet je normale wachtwoord.
