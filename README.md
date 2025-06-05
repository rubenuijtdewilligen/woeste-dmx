# woeste-dmx

DMX control panel for flatpub Woeste Hoeve in Wageningen.<br />
Maintained specifically for this pub, so it's probably not useful for you.

## Raspberry Pi

Running the server in the background:

```sh
nohup node woeste-dmx-server/index.js > out.log 2>&1 &
```

Finding the servers process ID:

```sh
ps aux | grep index.js
```

Then kill it with `kill <ID>`
