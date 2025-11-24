<script>
  import Router from 'svelte-spa-router';
  import Header from './lib/components/Header.svelte';
  import Sidebar from './lib/components/Sidebar.svelte';

  import Dashboard from './routes/Dashboard.svelte';
  import Expenses from './routes/Expenses.svelte';
  import Goals from './routes/Goals.svelte';
  import Investments from './routes/Investments.svelte';
  import Planning from './routes/Planning.svelte';
  import Cards from './routes/Cards.svelte';
  import Banks from './routes/Banks.svelte';
  import Receitas from './routes/Receitas.svelte';

  const routes = {
    '/': Dashboard,
    '/expenses': Expenses,
    '/goals': Goals,
    '/investments': Investments,
    '/planning': Planning,
    '/cards': Cards,
    '/banks': Banks,
    '/receitas': Receitas,
  };
</script>

<div class="app-container">
  <Header />
  <Sidebar />
  <main class="main-content">
    <Router {routes} />
  </main>
</div>

<style>
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .main-content {
    flex: 1;
    padding: 90px 30px 30px 130px;
  }
</style>

