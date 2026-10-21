# To-Do

## Software

- [ ] De pi-driver crasht soms of verliest verbinding met de D1024. Het zou mooi zijn als het script zelf de USB-verbinding probeert te herstellen zonder dat je via PM2 moet restarten.
- [ ] Iedereen op de wifi van de kroeg kan nu in principe POST-requests naar poort 3000 sturen. Het zou netter zijn om dit te beveiligen (API key of gewoon al een simpele origin check)
- [ ] Als iemand de calibrator sluit zonder op de "Stop"-knop te klikken, blijft de engine in calibratiemodus staan. Dit betekent dat de pars uit blijven tot de engine herstart wordt.
- [ ] De universe offset is nog hardcoded.
- [ ] Als de Pi nu herstart, valt alles terug naar de default waarden (rainbow, center). Het zou mooi zijn als de engine zijn laatste state wegschrijft (bijv. naar een JSON file) en deze weer inlaadt bij het opstarten.
- [ ] In het dashboard staan nog knoppen op non-actief (circle-wall, cross, wave, scissors). Deze bewegingen moeten wiskundig uitgedacht worden in calculateSpotPanTilt (movements.js) en daarna geactiveerd worden in het dashboard.
- [ ] Een werklicht scene.
- [ ] Voeg tijdstempels toe aan PM2 zodat debuggen makkelijker wordt (via pm2 restart all --time) en stel log-rotatie in.

## Hardware

### Spots

Er zijn Shark Spot Ones waar de lens niet recht voor de LED zit omdat de houder van die lens is gesmolten. Door nieuwe houders te 3D-printen, zou je de lens weer voor de LED kunnen fixeren waardoor het licht feller is.

### Parren

Veel parren missen een kleur. Dit komt meestal omdat die kleur in 1 pixel kapot is. R, G en B zijn in 3 banen in serie geschakeld door de fixture heen. Je kan de kleur dus repareren door voor die specifieke kleur om de kapotte pixel heen te solderen. Dit is al gedaan bij de par het dichtst bij de voordeur. Schroef die open als voorbeeld.
