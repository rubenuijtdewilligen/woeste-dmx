<script>
  import { env as publicEnv } from '$env/dynamic/public';
  import { onMount } from 'svelte';

  const startChannel = 1;

  let ch1 = 0;
  let ch2 = 0;
  let ch3 = 0;
  let ch4 = 0;

  const colors = [
    { name: 'Geen', value: 0 },
    { name: 'Rood', value: 6 },
    { name: 'Groen', value: 21 },
    { name: 'Blauw', value: 36 },
    { name: 'Wit', value: 51 },
    { name: 'Rood + Groen', value: 66 },
    { name: 'Rood + Blauw', value: 81 },
    { name: 'Rood + Wit', value: 96 },
    { name: 'Groen + Blauw', value: 111 },
    { name: 'Groen + Wit', value: 126 },
    { name: 'Blauw + Wit', value: 141 },
    { name: 'Rood + Groen + Blauw', value: 156 },
    { name: 'Rood + Groen + Wit', value: 171 },
    { name: 'Groen + Blauw + Wit', value: 186 },
    { name: 'Rood + Groen + Blauw + Wit', value: 201 },
    { name: 'Langzame overgang', value: 216 },
    { name: 'Snelle overgang', value: 230 }
  ];

  function setColor(val) {
    ch1 = val;
    send(0, val);
  }

  let strobeOn = false;
  let strobeSpeed = 0;

  function updateStrobe() {
    ch2 = strobeOn ? 6 + strobeSpeed : 0;
    send(1, ch2);
  }

  let rotationMode = 'manual';
  let manualRotation = 64;
  let autoRotationSpeed = 64;

  function updateRotation() {
    if (rotationMode === 'manual') {
      ch3 = manualRotation;
    } else {
      ch3 = 128 + autoRotationSpeed;
    }
    send(2, ch3);
  }

  let selectedEffect = 0;
  let effectSpeed = 0;

  const effectBases = [
    10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160, 170, 180
  ];

  function activateEffect(index) {
    selectedEffect = index;
    if (index < 17) {
      ch4 = effectBases[index] + effectSpeed;
    } else {
      ch4 = effectBases[index];
    }
    send(3, ch4);
  }

  function updateEffectSpeed(value) {
    effectSpeed = value;
    if (selectedEffect < 17) {
      ch4 = effectBases[selectedEffect] + effectSpeed;
      send(3, ch4);
    }
  }

  async function send(offset, value) {
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

      ch1 = savedValues[startChannel] ?? 0;
      ch2 = savedValues[startChannel + 1] ?? 0;
      ch3 = savedValues[startChannel + 2] ?? 0;
      ch4 = savedValues[startChannel + 3] ?? 0;

      if (ch2 >= 6) {
        strobeOn = true;
        strobeSpeed = ch2 - 6;
      } else {
        strobeOn = false;
        strobeSpeed = 0;
      }

      if (ch3 === 0) {
        rotationMode = 'manual';
        manualRotation = 1;
      } else if (ch3 <= 127) {
        rotationMode = 'manual';
        manualRotation = ch3;
      } else {
        rotationMode = 'auto';
        autoRotationSpeed = ch3 - 128;
      }

      if (ch4 >= 180) {
        selectedEffect = 17;
        effectSpeed = 0;
      } else {
        let effectIndex = Math.floor((ch4 - 10) / 10);
        effectIndex = Math.min(effectIndex, 16);
        selectedEffect = effectIndex;
        effectSpeed = ch4 - effectBases[effectIndex];
      }
    } catch (err) {
      console.error('Failed to load DMX values:', err);
    }
  });
</script>

<h1 class="mb-6 text-3xl font-bold">Showtec Techno Derby (kanaal 1-4, boven de zithoek)</h1>

<section class="mb-8">
  <h2 class="mb-2 text-xl font-semibold">Kleur (Kanaal 1)</h2>
  <div class="flex flex-wrap gap-2">
    {#each colors as c}
      <button class="btn" class:btn-primary={ch1 === c.value} on:click={() => setColor(c.value)}>
        {c.name}
      </button>
    {/each}
  </div>
</section>

<section class="mb-8">
  <h2 class="mb-2 text-xl font-semibold">Stroboscoop (Kanaal 2)</h2>
  <div class="flex items-center gap-4">
    <label>
      <input type="checkbox" bind:checked={strobeOn} on:change={updateStrobe} />
      Aan
    </label>
    {#if strobeOn}
      <label>
        Snelheid:
        <input
          type="range"
          min="0"
          max="249"
          bind:value={strobeSpeed}
          on:input={(e) => updateStrobe()}
        />
        <span>{strobeSpeed}</span>
      </label>
    {/if}
  </div>
</section>

<section class="mb-8">
  <h2 class="mb-2 text-xl font-semibold">Rotatie (Kanaal 3)</h2>
  <div class="mb-2 flex items-center gap-6">
    <label>
      <input type="radio" bind:group={rotationMode} value="manual" on:change={updateRotation} />
      Handmatig
    </label>
    <label>
      <input type="radio" bind:group={rotationMode} value="auto" on:change={updateRotation} />
      Automatisch
    </label>
  </div>

  {#if rotationMode === 'manual'}
    <label>
      Positie:
      <input
        type="range"
        min="1"
        max="127"
        bind:value={manualRotation}
        on:input={() => updateRotation()}
      />
      <span>{manualRotation}</span>
    </label>
  {:else}
    <label>
      Snelheid:
      <input
        type="range"
        min="0"
        max="127"
        bind:value={autoRotationSpeed}
        on:input={() => updateRotation()}
      />
      <span>{autoRotationSpeed}</span>
    </label>
  {/if}
</section>

<section>
  <h2 class="mb-4 text-xl font-semibold">Stroboscoopeffecten (Kanaal 4)</h2>
  <div class="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
    {#each Array(18) as _, i}
      <button
        class="btn"
        class:btn-primary={i === selectedEffect}
        on:click={() => activateEffect(i)}
      >
        Effect {i + 1}
      </button>
    {/each}
  </div>

  {#if selectedEffect < 17}
    <label>
      Snelheid:
      <input
        type="range"
        min="0"
        max="9"
        bind:value={effectSpeed}
        on:input={(e) => updateEffectSpeed(+e.target.value)}
      />
      <span>{effectSpeed}</span>
    </label>
  {/if}
</section>

<style>
  input[type='range'] {
    width: 200px;
  }
</style>
