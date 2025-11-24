<script>
  import { onMount } from 'svelte';
  import api from '../lib/services/api.js';
  import { formatCurrency, calculatePercentage } from '../lib/utils.js';

  let planejamento = null;
  let metas = [];
  let investimentos = [];
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      loading = true;
      const [planData, metasData, investData] = await Promise.all([
        api.getPlanejamento(),
        api.getMetas(),
        api.getInvestimentos()
      ]);
      
      planejamento = planData;
      metas = metasData;
      investimentos = investData;
    } catch (err) {
      error = err.message;
      console.error('Error loading dashboard:', err);
    } finally {
      loading = false;
    }
  });

  $: totalInvestido = investimentos.reduce((sum, inv) => sum + (inv.totalInvestido || 0), 0);
</script>

<div class="dashboard">
  <h1>Dashboard Financeiro</h1>

  {#if loading}
    <div class="loading">Carregando dados...</div>
  {:else if error}
    <div class="error">Erro ao carregar dados: {error}</div>
  {:else}
    <!-- Quick Stats -->
    <div class="stats-grid">
      <div class="stat-card income">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <h3>Receita Total</h3>
          <p class="stat-value">{formatCurrency(planejamento?.receitaTotal || 0)}</p>
        </div>
      </div>

      <div class="stat-card expense">
        <div class="stat-icon">💸</div>
        <div class="stat-content">
          <h3>Despesas</h3>
          <p class="stat-value">{formatCurrency(planejamento?.despesaTotal || 0)}</p>
        </div>
      </div>

      <div class="stat-card savings">
        <div class="stat-icon">🏦</div>
        <div class="stat-content">
          <h3>Poupança</h3>
          <p class="stat-value">{formatCurrency(planejamento?.poupancaTotal || 0)}</p>
        </div>
      </div>

      <div class="stat-card balance">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <h3>Saldo Livre</h3>
          <p class="stat-value">{formatCurrency(planejamento?.saldoLivre || 0)}</p>
        </div>
      </div>
    </div>

    <!-- Goals Section -->
    <div class="section">
      <h2>Metas Financeiras</h2>
      <div class="goals-grid">
        {#if metas.length === 0}
          <p class="empty-state">Nenhuma meta cadastrada</p>
        {:else}
          {#each metas as meta}
            <div class="goal-card">
              <h3>{meta.nome}</h3>
              {#if meta.descricao}
                <p class="goal-description">{meta.descricao}</p>
              {/if}
              <div class="goal-progress">
                <div class="progress-bar">
                  <div 
                    class="progress-fill" 
                    style="width: {calculatePercentage(meta.valorAlcancado, meta.valorObjetivo)}%"
                  ></div>
                </div>
                <div class="progress-text">
                  <span>{formatCurrency(meta.valorAlcancado)}</span>
                  <span>{formatCurrency(meta.valorObjetivo)}</span>
                </div>
                <div class="progress-percentage">
                  {calculatePercentage(meta.valorAlcancado, meta.valorObjetivo).toFixed(1)}%
                </div>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>

    <!-- Investments Section -->
    <div class="section">
      <h2>Investimentos</h2>
      <div class="investments-summary">
        <div class="investment-total">
          <h3>Total Investido</h3>
          <p class="total-value">{formatCurrency(totalInvestido)}</p>
        </div>
        <div class="investments-list">
          {#if investimentos.length === 0}
            <p class="empty-state">Nenhum investimento cadastrado</p>
          {:else}
            {#each investimentos as inv}
              <div class="investment-item">
                <span class="investment-name">{inv.nome}</span>
                <span class="investment-value">{formatCurrency(inv.totalInvestido)}</span>
              </div>
            {/each}
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .dashboard {
    max-width: 1400px;
    margin: 0 auto;
  }

  h1 {
    color: #2d3748;
    margin-bottom: 2rem;
  }

  .loading, .error {
    text-align: center;
    padding: 2rem;
    font-size: 1.1rem;
  }

  .error {
    color: #e53e3e;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }

  .stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .stat-icon {
    font-size: 2.5rem;
  }

  .stat-content h3 {
    margin: 0 0 0.5rem 0;
    font-size: 0.9rem;
    color: #718096;
    font-weight: 500;
  }

  .stat-value {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 700;
    color: #2d3748;
  }

  .section {
    background: white;
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .section h2 {
    margin: 0 0 1.5rem 0;
    color: #2d3748;
  }

  .goals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .goal-card {
    background: #f7fafc;
    border-radius: 8px;
    padding: 1.5rem;
  }

  .goal-card h3 {
    margin: 0 0 0.5rem 0;
    color: #2d3748;
  }

  .goal-description {
    color: #718096;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .progress-bar {
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    transition: width 0.3s ease;
  }

  .progress-text {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    color: #718096;
    margin-bottom: 0.25rem;
  }

  .progress-percentage {
    text-align: center;
    font-weight: 600;
    color: #667eea;
  }

  .empty-state {
    text-align: center;
    color: #a0aec0;
    padding: 2rem;
  }

  .investments-summary {
    display: grid;
    gap: 1.5rem;
  }

  .investment-total {
    text-align: center;
    padding: 1.5rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 8px;
  }

  .investment-total h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    opacity: 0.9;
  }

  .total-value {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
  }

  .investments-list {
    display: grid;
    gap: 0.75rem;
  }

  .investment-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f7fafc;
    border-radius: 8px;
  }

  .investment-name {
    font-weight: 500;
    color: #2d3748;
  }

  .investment-value {
    font-weight: 600;
    color: #667eea;
  }
</style>

