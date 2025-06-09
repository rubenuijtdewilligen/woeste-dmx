<script>
  import '../app.css';
</script>

<div class="navbar bg-base-100 shadow-sm">
  <div class="flex-1">
    <a class="btn btn-ghost p-0 p-4 text-xl" href="/">
      <img src="/logo.svg" alt="Woeste Hoeve Logo" class="max-h-6" />
      Woeste Hoeve DMX Control
    </a>
  </div>

  <div class="hidden md:flex md:flex-none">
    <p class="p-4">Vragen of kapot? 06 53876766</p>
  </div>
</div>

<div class="drawer lg:drawer-open">
  <input id="my-drawer-2" type="checkbox" class="drawer-toggle" />

  <div class="drawer-content flex flex-col">
    <!-- Drawer button for mobile -->
    <label for="my-drawer-2" class="btn btn-primary drawer-button m-auto mb-4 w-min lg:hidden">
      Menu
    </label>

    <!-- Page content -->
    <div class="px-4">
      <slot></slot>
    </div>
  </div>

  <div class="drawer-side">
    <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu bg-base-200 text-base-content min-h-full w-max p-4">
      <li><a href="/raw">Ruwe data sliders</a></li>
    </ul>
  </div>
</div>
