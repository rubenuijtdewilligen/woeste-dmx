# 🎛️ Woeste Hoeve DMX

Dit project is gebouwd om de lampen in de kroeg aan te sturen via een web dashboard. Het is geschreven in Node.js en bestaat uit een engine die 30x per seconde DMX waarden berekent, en een driver die via een QuickDMX D1024 USB-interface de lampen aanstuurt. Hiervoor gebruiken we [node-d1024](https://github.com/rubenuijtdewilligen/node-d1024).

## Architecture

Dit is een monorepo met drie onderdelen:

1. **`apps/engine`**: Beheert de state (kleuren, posities, BPM) en berekent 30 frames per seconde
2. **`apps/pi-driver`**: Ontvangt DMX frames van de engine en stuurt ze via node-d1024 naar de fixtures
3. **`apps/calibrator`**: Een tool om de spots handmatig te richten

Het dashboard dat je in de kroeg gebruikt om de kleuren of posities te veranderen, zit in de codebase van de website van de Woeste. Deze website is closed-source en blijft dat ook. Mocht je een aanpassing in de pagina voor de lichtsturing willen, neem dan contact met mij op.

## Local development

Je kunt de engine gewoon op je laptop draaien om effecten te testen.

1. Zorg dat je [Node.js](https://node.js.org/) hebt geïnstalleerd.
2. Installeer dependencies:
   ```bash
   npm install
   ```
3. Start de engine lokaal:
   ```bash
   npm run start:engine
   ```
   De engine draait nu op `http://localhost:3000`. Om dit live te testen, kun je de `pi-driver` op de Raspberry Pi in de computerkast tijdelijk naar het IP-adres van jouw laptop laten wijzen of een SSH-tunnel opzetten (zie [CONTRIBUTING.md](CONTRIBUTING.md)).

## Deploying

Updates zet je rechtstreeks vanaf je laptop op de Pi via `rsync` op Linux/Mac of bijvoorbeeld via [FTP](https://nl.wikipedia.org/wiki/File_transfer_protocol).

```bash
# 1. Sync je lokale bestanden naar de Pi
rsync -av --exclude node_modules --exclude .git ./ woestehoeve@woestedmx.local:~/woeste-dmx/

# 2. Log in en herstart de services via PM2
ssh woestehoeve@woestedmx.local 'cd ~/woeste-dmx/apps/engine && npm install && pm2 restart dmx-engine && pm2 restart dmx-driver'
```

We doen bewust niet aan automatische deployments via GitHub Actions (CI/CD) naar de Pi, zodat ik deze repository niet actief hoef te monitoren.

Als je een update doet, zou ik het wel leuk vinden om een pull request te ontvangen (zie [CONTRIBUTING.md](CONTRIBUTING.md)).
