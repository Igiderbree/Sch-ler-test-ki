# Schule Test Plattform

Ein einfaches Beispiel für eine Plattform, auf der Lehrer Tests erstellen können und Schüler sie bearbeiten.

## Entwicklung

1. `npm install`
2. Kopiere `.env.example` nach `.env` und trage deine Zugangsdaten und den OpenAI API Key ein.
3. `python start.py` startet den Entwicklungsserver auf Port 3000.
   Alternativ kann der Server auch mit `npm start` gestartet werden.

Die App enthält:
- Login für Admin, Lehrer und Schüler.
- Lehrer können Tests erstellen (optional mit KI generiert).
- Schüler können freigeschaltete Tests abrufen und abgeben.
- Einfache Auswertung über die OpenAI API (Platzhalter).
- Nach dem Login landen Benutzer auf einem einfachen Dashboard mit Seitenleiste
  und Bereichen für "Mein Konto", Benutzerverwaltung und Schülerordner.

## Datenablage

Benutzer- und Testdaten werden als JSON-Dateien im Verzeichnis `data/`
gespeichert. Beim ersten Start werden die Dateien automatisch erstellt, falls sie
nicht vorhanden sind. Das Bearbeiten von `data/users.json` ermöglicht das
Hinzufügen weiterer Beispielkonten.

Dies ist nur ein grundlegendes Gerüst.
