<script>
  import { env as publicEnv } from '$env/dynamic/public';
  import { onMount } from 'svelte';

  const startChannel = 5;

  // Channels 1-10
  let ch = Array(10).fill(0);

  // UV Dimmer
  function setUV1(value) {
    ch[0] = value;
    send(0, value);
  }
  function setUV2(value) {
    ch[1] = value;
    send(1, value);
  }

  // Strobe UV
  let strobeUVSpeed = 0;
  let strobeUVSoundControl = false;
  function updateStrobeUV() {
    ch[2] = strobeUVSoundControl ? 251 : strobeUVSpeed;
    send(2, ch[2]);
  }

  // Matrix programs (CH4)
  // Values 0-5 no function, then increments of 8 per program up to 31 programs
  const matrixPrograms = Array.from({ length: 32 }, (_, i) => ({
    name: i === 0 ? 'Geen' : `Programma ${i}`,
    value: i === 0 ? 0 : 6 + (i - 1) * 8
  }));
  let selectedMatrixProgram = 0;

  function setMatrixProgram(index) {
    selectedMatrixProgram = index;
    ch[3] = matrixPrograms[index].value;
    send(3, ch[3]);
  }

  // Speed for Matrix programs (CH5)
  let matrixSpeed = 0;
  let matrixSpeedSoundControl = false;
  function updateMatrixSpeed() {
    ch[4] = matrixSpeedSoundControl ? 251 : matrixSpeed;
    send(4, ch[4]);
  }

  // Laser (CH6)
  const laserModes = [
    { name: 'Geen', value: 0 },
    { name: 'Rood', value: 6 },
    { name: 'Groen', value: 49 },
    { name: 'Rood + Groen', value: 90 },
    { name: 'Rood strobe + Groen', value: 132 },
    { name: 'Rood + Groen strobe', value: 174 },
    { name: 'Rood strobe + Groen strobe (afwisselend)', value: 216 }
  ];
  let selectedLaserMode = 0;

  function setLaserMode(index) {
    selectedLaserMode = index;
    ch[5] = laserModes[index].value;
    send(5, ch[5]);
  }

  // Laser Strobe (CH7)
  let laserStrobeSpeed = 0;
  let laserStrobeSoundControl = false;
  function updateLaserStrobe() {
    ch[6] = laserStrobeSoundControl ? 251 : laserStrobeSpeed;
    send(6, ch[6]);
  }

  // Laser Rotation (CH8)
  // 0 stop, 1-127 cw speed, 128 stop, 129-255 ccw speed
  let laserRotationDirection = 'stop'; // 'stop', 'cw', 'ccw'
  let laserRotationSpeed = 0; // 0-127
  function updateLaserRotation() {
    if (laserRotationDirection === 'stop') {
      ch[7] = 0;
    } else if (laserRotationDirection === 'cw') {
      ch[7] = laserRotationSpeed || 1;
    } else if (laserRotationDirection === 'ccw') {
      ch[7] = 128 + (laserRotationSpeed || 1);
    }
    send(7, ch[7]);
  }

  // White SMDs programs (CH9)
  const whitePrograms = [
    { name: 'Geen', value: 0 },
    { name: 'Programma 1', value: 6 },
    { name: 'Programma 2', value: 28 },
    { name: 'Programma 3', value: 51 },
    { name: 'Programma 4', value: 74 },
    { name: 'Programma 5', value: 96 },
    { name: 'Programma 6', value: 119 },
    { name: 'Programma 7', value: 142 },
    { name: 'Programma 8', value: 164 },
    { name: 'Programma 9', value: 187 },
    { name: 'Programma 10', value: 210 },
    { name: 'Programma 11', value: 233 }
  ];
  let selectedWhiteProgram = 0;

  function setWhiteProgram(index) {
    selectedWhiteProgram = index;
    ch[8] = whitePrograms[index].value;
    send(8, ch[8]);
  }

  // White program speed (CH10)
  let whiteSpeed = 0;
  let whiteSpeedSoundControl = false;
  function updateWhiteSpeed() {
    ch[9] = whiteSpeedSoundControl ? 251 : whiteSpeed;
    send(9, ch[9]);
  }

  // Send DMX command to API
  async function send(offset, value) {
    ch[offset] = value;
    await fetch(publicEnv.PUBLIC_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel: startChannel + offset, value })
    });
  }

  onMount(async () => {
    try {
      const res = await fetch(publicEnv.PUBLIC_API_URL);
      const savedValues = await res.json();

      for (let i = 0; i < 10; i++) {
        ch[i] = savedValues[startChannel + i] ?? 0;
      }

      // Init form states from loaded values

      // Strobe UV
      strobeUVSoundControl = ch[2] >= 251;
      strobeUVSpeed = strobeUVSoundControl ? 0 : ch[2];

      // Matrix program
      selectedMatrixProgram = matrixPrograms.findIndex((p) => p.value === ch[3]);
      if (selectedMatrixProgram === -1) selectedMatrixProgram = 0;

      // Matrix speed
      matrixSpeedSoundControl = ch[4] >= 251;
      matrixSpeed = matrixSpeedSoundControl ? 0 : ch[4];

      // Laser mode
      selectedLaserMode = laserModes.findIndex((l) => l.value === ch[5]);
      if (selectedLaserMode === -1) selectedLaserMode = 0;

      // Laser strobe
      laserStrobeSoundControl = ch[6] >= 251;
      laserStrobeSpeed = laserStrobeSoundControl ? 0 : ch[6];

      // Laser rotation
      if (ch[7] === 0 || ch[7] === 128) {
        laserRotationDirection = 'stop';
        laserRotationSpeed = 0;
      } else if (ch[7] > 0 && ch[7] < 128) {
        laserRotationDirection = 'cw';
        laserRotationSpeed = ch[7];
      } else {
        laserRotationDirection = 'ccw';
        laserRotationSpeed = ch[7] - 128;
      }

      // White program
      selectedWhiteProgram = whitePrograms.findIndex((p) => p.value === ch[8]);
      if (selectedWhiteProgram === -1) selectedWhiteProgram = 0;

      // White speed
      whiteSpeedSoundControl = ch[9] >= 251;
      whiteSpeed = whiteSpeedSoundControl ? 0 : ch[9];
    } catch (err) {
      console.error('Failed to load DMX values:', err);
    }
  });
</script>

<h1 class="mb-6 text-3xl font-bold">
  Eurolite LED Compact Multi FX Laser Bar (linksachter in de zaal, kanaal 5-14)
</h1>

<section class="mb-8">
  <h2 class="mb-2 text-xl font-semibold">UV Dimmer 1 (Kanaal 1)</h2>
  <input type="range" min="0" max="255" bind:value={ch[0]} on:input={() => setUV1(ch[0])} />
  <span>{Math.round((ch[0] / 255) * 100)}%</span>
</section>

<section class="mb-8">
  <h2 class="mb-2 text-xl font-semibold">UV Dimmer 2 (Kanaal 2)</h2>
  <input type="range" min="0" max="255" bind:value={ch[1]} on:input={() => setUV2(ch[1])} />
  <span>{Math.round((ch[1] / 255) * 100)}%</span>
</section>

<section class="mb-8">
  <h2 class="mb-2 text-xl font-semibold">Strobe UV (Kanaal 3)</h2>
  <label class="flex items-center gap-2">
    <input type="checkbox" bind:checked={strobeUVSoundControl} on:change={updateStrobeUV} />
    Sound control strobe
  </label>
  {#if !strobeUVSoundControl}
    <label class="mt-2 flex items-center gap-2">
      Snelheid:
      <input type="range" min="0" max="250" bind:value={strobeUVSpeed} on:input={updateStrobeUV} />
      <span>{strobeUVSpeed}</span>
    </label>
  {/if}
</section>

<section class="mb-8">
  <h2 class="mb-2 text-xl font-semibold">Matrix Programma (Kanaal 4)</h2>
  <div class="flex max-w-xl flex-wrap gap-2">
    {#each matrixPrograms as program, i}
      <button
        class="btn"
        class:btn-primary={selectedMatrixProgram === i}
        on:click={() => setMatrixProgram(i)}
      >
        {program.name}
      </button>
    {/each}
  </div>
</section>

<section class="mb-8">
  <h2 class="mb-2 text-xl font-semibold">Matrix Snelheid (Kanaal 5)</h2>
  <label class="flex items-center gap-2">
    <input type="checkbox" bind:checked={matrixSpeedSoundControl} on:change={updateMatrixSpeed} />
    Sound control snelheid
  </label>
  {#if !matrixSpeedSoundControl}
    <input type="range" min="0" max="250" bind:value={matrixSpeed} on:input={updateMatrixSpeed} />
    <span>{matrixSpeed}</span>
  {/if}
</section>

<section class="mb-8">
  <h2 class="mb-2 text-xl font-semibold">Laser Modus (Kanaal 6)</h2>
  <div class="flex max-w-xl flex-wrap gap-2">
    {#each laserModes as mode, i}
      <button
        class="btn"
        class:btn-primary={selectedLaserMode === i}
        on:click={() => setLaserMode(i)}
      >
        {mode.name}
      </button>
    {/each}
  </div>
</section>

<section class="mb-8">
  <h2 class="mb-2 text-xl font-semibold">Laser Strobe (Kanaal 7)</h2>
  <label class="flex items-center gap-2">
    <input type="checkbox" bind:checked={laserStrobeSoundControl} on:change={updateLaserStrobe} />
    Sound control strobe
  </label>
  {#if !laserStrobeSoundControl}
    <input
      type="range"
      min="0"
      max="250"
      bind:value={laserStrobeSpeed}
      on:input={updateLaserStrobe}
    />
    <span>{laserStrobeSpeed}</span>
  {/if}
</section>

<section class="mb-8">
  <h2 class="mb-2 text-xl font-semibold">Laser Rotatie (Kanaal 8)</h2>
  <div class="mb-2 flex gap-4">
    <label class="flex items-center gap-2">
      <input
        type="radio"
        bind:group={laserRotationDirection}
        value="stop"
        on:change={updateLaserRotation}
      />
      Stop
    </label>
    <label class="flex items-center gap-2">
      <input
        type="radio"
        bind:group={laserRotationDirection}
        value="cw"
        on:change={updateLaserRotation}
      />
      Rechtsom
    </label>
    <label class="flex items-center gap-2">
      <input
        type="radio"
        bind:group={laserRotationDirection}
        value="ccw"
        on:change={updateLaserRotation}
      />
      Linksom
    </label>
  </div>
  {#if laserRotationDirection === 'cw' || laserRotationDirection === 'ccw'}
    <label class="flex items-center gap-2">
      Snelheid:
      <input
        type="range"
        min="1"
        max="127"
        bind:value={laserRotationSpeed}
        on:input={updateLaserRotation}
      />
      <span>{laserRotationSpeed}</span>
    </label>
  {/if}
</section>

<section class="mb-8">
  <h2 class="mb-2 text-xl font-semibold">White SMD Programma (Kanaal 9)</h2>
  <div class="flex max-w-xl flex-wrap gap-2">
    {#each whitePrograms as program, i}
      <button
        class="btn"
        class:btn-primary={selectedWhiteProgram === i}
        on:click={() => setWhiteProgram(i)}
      >
        {program.name}
      </button>
    {/each}
  </div>
</section>

<section>
  <h2 class="mb-2 text-xl font-semibold">White Programma Snelheid (Kanaal 10)</h2>
  <label class="flex items-center gap-2">
    <input type="checkbox" bind:checked={whiteSpeedSoundControl} on:change={updateWhiteSpeed} />
    Sound control snelheid
  </label>
  {#if !whiteSpeedSoundControl}
    <input type="range" min="0" max="250" bind:value={whiteSpeed} on:input={updateWhiteSpeed} />
    <span>{whiteSpeed}</span>
  {/if}
</section>

<style>
  input[type='range'] {
    width: 200px;
  }
</style>
