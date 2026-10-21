# Bijdragen aan woeste-dmx

Leuk dat je wilt bijdragen aan de verlichting van de kroeg! Bij deze een aantal richtlijnen en tips.

## Veelvoorkomende aanpassingen

- **Nieuw kleurenpalet:** Voeg je kleuren toe in `apps/engine/engine/palettes.js`.
- **Vaste spotposities:** Gebruik de calibrator (`apps/calibrator/index.html`), kopieer de output en plak het in `apps/engine/engine/movements.js`.
- **Lampen toevoegen/wijzigen:** Pas de adressen aan in `apps/engine/config/fixtures.js`.

## Beleid rondom pull requests

Je hoeft geen goedgekeurde pull request (PR) te hebben om het licht in de kroeg aan te passen. Je bent vrij om deze code lokaal aan te passen en via op de Raspberry Pi in de kroeg te deployen.

**Waarom dan wel een PR aanmaken?**
Omdat het voor mij (en potentiële andere bijdragers) leuk is om te zien dat het systeem nog leeft en wordt uitgebreid! Als je iets hebt aangepast, stuur dan gerust een PR in.

## Live testen vanaf je laptop

Als je aan de engine werkt, is het irritant om steeds code te pushen om te kijken of het er leuk uitziet. Je kunt je laptop direct met de lampen laten communiceren!

**Via een SSH Tunnel**

1. Start de engine lokaal op je laptop (`npm run start:engine`).
2. Zet de engine op de Pi tijdelijk uit: `ssh woestehoeve@woestedmx.local pm2 stop dmx-engine`.
3. Stuur poort 3000 van de Pi door naar je laptop: `ssh -R 3000:localhost:3000 woestehoeve@woestedmx.local` (laat deze terminal open).
4. De lampen luisteren nu naar de code op jouw laptop!
5. **Vergeet niet** na afloop de tunnel te sluiten en de engine op de Pi weer aan te zetten (`pm2 start dmx-engine`), anders zit de kroeg in het donker.

## Richtlijnen

- **Houd het licht 30fps:** Zorg dat berekeningen in `server.js` en `palettes.js` snel blijven. Vermijd zware loops in de `setInterval`.
- **Hardware correcties:** Let op `ONLY_RED_ADDRESSES`, `NO_GREEN_ADDRESSES` etc. in `palettes.js`. De parren zijn tweedehands en hebben kapotte ledjes; de software compenseert dit door kleuren bij te mengen.

## Wat er op dit moment valt bij te dragen

In [TODO.md](TODO.md) vind je dingen die nog verbeterd kunnen worden aan de software én aan de hardware.

## Contact

Ik (Ruben Uijtdewilligen, feestcommissaris 2025-2026) ben de originele developer van woeste-dmx. Mijn contactgegevens staan in de computerkast geschreven.
