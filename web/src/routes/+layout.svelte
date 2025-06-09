<script>
  import '../app.css';
  import { page } from '$app/stores';

  const navItems = [
    { name: 'Showtec Techno Derby', path: '/fixtures/techno-derby' },
    { name: 'Ruwe data sliders', path: '/raw' }
  ];
</script>

<div class="navbar bg-gray-300 shadow-sm">
  <div class="flex-1">
    <a class="btn btn-ghost text-xl" href="/">
      <img src="/logo.svg" alt="Woeste Hoeve Logo" class="max-h-6" />
      Woeste Hoeve DMX Control
    </a>
  </div>

  <div class="hidden md:flex md:flex-none">
    <p class="p-4">Copyright 2025-heden © Ruben Uijtdewilligen</p>
  </div>
</div>

<div class="drawer lg:drawer-open">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />

  <div class="drawer-content flex flex-col">
    <label for="my-drawer-2" class="btn btn-primary drawer-button m-auto mb-4 w-min lg:hidden">
      Menu
    </label>

    <div class="px-4 py-4">
      <slot></slot>
    </div>
  </div>

  <div class="drawer-side">
    <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu text-base-content min-h-full w-max bg-gray-200 p-4">
      {#each navItems as item}
        <li>
          <a
            href={item.path}
            class="hover:bg-gray-300
            {$page.url.pathname.startsWith(item.path) ? 'bg-gray-300' : ''}"
          >
            {item.name}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</div>
