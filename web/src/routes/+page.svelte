<script>
  import { env as publicEnv } from '$env/dynamic/public';

  const numSliders = 4;

  let values = Array(numSliders).fill(0);

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

<main>
  {#each Array(numSliders) as _, index}
    <div class="slider">
      <label for="slider-{index}">Kanaal {index + 1}: {values[index]}</label>
      <input
        id="slider-{index}"
        type="range"
        class="range"
        min="0"
        max="255"
        bind:value={values[index]}
        on:input={(e) => updateValue(index, +e.target.value)}
      />
    </div>
  {/each}
</main>

<style>
  main {
    max-width: 600px;
    margin: 2rem auto;
    font-family: sans-serif;
  }

  .slider {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
</style>
