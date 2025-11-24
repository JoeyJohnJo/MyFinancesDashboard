<script>
  import { link, location } from 'svelte-spa-router';

  const menuItems = [
    { path: '/', label: 'Painel', icon: '📊' },
    { path: '/expenses', label: 'Despesas', icon: '💰' },
    { path: '/investments', label: 'Investimentos', icon: '📈' },
    { path: '/goals', label: 'Metas', icon: '🎯' },
    { path: '/planning', label: 'Planejamento', icon: '📅' },
    { path: '/cards', label: 'Cartões', icon: '💳' },
    { path: '/banks', label: 'Bancos', icon: '🏦' },
    { path: '/receitas', label: 'Receitas', icon: '💵' },
  ];
</script>

<div class="sidebar">
  {#each menuItems as item}
    <a href={item.path} use:link class="nav-item {$location === item.path ? 'active' : ''}">
      <div class="nav-icon">{item.icon}</div>
      <div class="nav-label">{item.label}</div>
    </a>
  {/each}
</div>

<style>
  .sidebar {
    width: 100px;
    background-color: #ffffff;
    padding: 90px 0 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 50;
  }

  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 70px;
    height: 70px;
    border-radius: 16px;
    margin-bottom: 10px;
    color: #8a94a6;
    text-decoration: none;
    transition: all 0.3s;
    cursor: pointer;
  }

  .nav-item:hover {
    background-color: #f0f5ff;
    color: #4169e1;
  }

  .nav-item.active {
    background-color: #4169e1;
    color: white;
  }

  .nav-icon {
    font-size: 24px;
    margin-bottom: 5px;
  }

  .nav-label {
    font-size: 10px;
    text-align: center;
  }
</style>

