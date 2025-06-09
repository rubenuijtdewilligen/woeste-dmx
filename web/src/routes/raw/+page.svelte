<script>
  import { env as publicEnv } from '$env/dynamic/public';
  import { onMount } from 'svelte';

  const numSliders = 512;
  let values = Array(numSliders).fill(0);

  onMount(async () => {
    try {
      const res = await fetch(publicEnv.PUBLIC_API_URL);
      const savedValues = await res.json();

      for (let i = 0; i < numSliders; i++) {
        values[i] = savedValues[i + 1] ?? 0;
      }
    } catch (err) {
      console.error('Failed to load DMX values:', err);
    }
  });

  async function send(channel, value) {
    await fetch(publicEnv.PUBLIC_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channel, value })
    });
  }

  function updateValue(index, value) {
    values[index] = value;
    send(index + 1, value);
  }
</script>

<div class="mt-4 overflow-x-auto">
  <div class="flex space-x-1">
    {#each Array(numSliders) as _, index}
      <div class="flex w-16 flex-col items-center border-2 p-2">
        <h2 class="text-2xl font-bold">
          {values[index]}
        </h2>

        <input
          type="range"
          min="0"
          max="255"
          class="vertical-slider"
          bind:value={values[index]}
          on:input={(e) => updateValue(index, +e.target.value)}
          id="slider-{index}"
        />

        <h2 class="text-2xl font-bold">
          {index + 1}
        </h2>
      </div>
    {/each}
  </div>
</div>

<style>
  .vertical-slider {
    writing-mode: bt-lr;
    appearance: slider-vertical;
    -webkit-appearance: slider-vertical;
    width: 1rem;
    height: 10rem;
  }
</style>
