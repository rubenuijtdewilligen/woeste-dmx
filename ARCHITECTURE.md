# Architectuur

## Het grote plaatje

Omdat het dashboard op een externe server staat, maar de lampen lokaal in de kroeg hangen, is er een directe Socket.IO verbinding nodig vanaf de browser naar de Raspberry Pi.

```PLAINTEXT
┌───────────────────────────────┐
│ Website / Dashboard           │ (Browser op computer in de kroeg)
└───────────────────────────────┘
               │
               │ Socket.io verbinding
               ▼
┌───────────────────────────────┐
│ Raspberry Pi                  │
│ [dmx-engine] & [dmx-driver]   │
└───────────────────────────────┘
               │
               │ USB Kabel
               ▼
┌───────────────────────────────┐
│ QuickDMX D1024                │
└───────────────────────────────┘
               │
               │ DMX Kabel (Universe 2, want Universe 1 lijkt kapot)
               ▼
┌───────────────────────────────┐
│ Lampen                        │
└───────────────────────────────┘
```

## Netwerk

Het dashboard is onderdeel van de website van de Woeste. Deze draait dus in de cloud. De pagina in het admin dashboard laadt in principe overal, maar de functionaliteit werkt alleen als je fysiek in het kroegnetwerk bent (of via een VPN/Tailscale bent verbonden). De browser praat direct met de Pi.

De [spot calibrator](/apps/calibrator/) is een losse HTML-pagina die direct praat met de engine.

De Pi draait [Tailscale](https://tailscale.com/), waardoor hij extern bereikbaar is. Het Tailscale account is gekoppeld aan het Google account van de Woeste.

## Software (engine vs. driver)

Er draaien twee Node.js processen op de Pi:

`dmx-engine`: Hier zit geen hardware-afhankelijkheid in. Dit proces regelt de webserver, de state, de API, en berekent de wiskunde achter de bewegingen.

`dmx-driver`: Dit proces heeft toegang tot de USB-poort en praat via [rubenuijtdewilligen/node-d1024](https://github.com/rubenuijtdewilligen/node-d1024) met de D1024 hardware.

Het voordeel van deze opsplitsing is dat je de engine lokaal op je eigen laptop kunt draaien om effecten te programmeren, terwijl je de driver op de Pi instelt om naar het IP-adres van jouw laptop te luisteren. Ook de calibrator maakt hier gebruik van.

## DMX bekabeling

De Raspberry Pi is via USB verbonden met de QuickDMX D1024.

De eerste uitgang van deze D1024 lijkt kapot te zijn (geeft in ieder geval vaak storing). Daarom gebruiken we uitgang 2 en daarbij ook DMX universe 2. De driver stuurt de kanalen daarom met een offset van 512.

De lampen hangen in een daisy-chain (doorgelust) aan deze kabel. Van de D1024 ga je eerst naar de par bij de nooddeur, dan rechtsom door alle parren naar de laatste bij de voordeur. Van daaruit gaan we naar de spots boven de dansvloer en uiteindelijk naar de blinders op de koof.

De adressen staan in config/fixtures.js. Soms drukken mensen per ongeluk (of toch, dat hoop je dan) op de knoppen, dus ook daarvoor kan je in dat bestand terugzoeken. De parren beginnen met tellen bij de nooddeur en gaan rechtsom.
