<script>
  import { onMount } from 'svelte';
  import api from '../lib/services/api.js';
  import { formatCurrency } from '../lib/utils.js';

  let planejamento = null;
  let loading = true;
  let error = null;

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    try {
      loading = true;
      planejamento = await api.getPlanejamento();
    } catch (err) {
      error = err.message;
      console.error('Error loading planning:', err);
    } finally {
      loading = false;
    }
  }

  $: receitaPercentage = planejamento ? (planejamento.receitaTotal / planejamento.receitaTotal) * 100 : 0;
  $: despesaPercentage = planejamento ? (planejamento.despesaTotal / planejamento.receitaTotal) * 100 : 0;
  $: poupancaPercentage = planejamento ? (planejamento.poupancaTotal / planejamento.receitaTotal) * 100 : 0;
</script>

<div class="planning-page">
  <div class="dashboard-header">
    <div>
      <h1 class="dashboard-title">Planejamento Financeiro</h1>
      <p class="dashboard-subtitle">Visão geral do seu planejamento mensal</p>
    </div>
  </div>

  {#if loading}
    <div class="loading">Carregando dados...</div>
  {:else if error}
    <div class="error">Erro ao carregar dados: {error}</div>
  {:else if planejamento}
    <div class="planning-grid">
      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card income">
          <div class="card-icon">💰</div>
          <div class="card-content">
            <h3>Receita Total</h3>
            <p class="card-value">{formatCurrency(planejamento.receitaTotal)}</p>
            <span class="card-badge">100% da receita</span>
          </div>
        </div>

        <div class="summary-card expense">
          <div class="card-icon">💸</div>
          <div class="card-content">
            <h3>Despesas Totais</h3>
            <p class="card-value">{formatCurrency(planejamento.despesaTotal)}</p>
            <span class="card-badge">{despesaPercentage.toFixed(1)}% da receita</span>
          </div>
        </div>

        <div class="summary-card savings">
          <div class="card-icon">🏦</div>
          <div class="card-content">
            <h3>Poupança</h3>
            <p class="card-value">{formatCurrency(planejamento.poupancaTotal)}</p>
            <span class="card-badge">{poupancaPercentage.toFixed(1)}% da receita</span>
          </div>
        </div>

        <div class="summary-card balance">
          <div class="card-icon">📊</div>
          <div class="card-content">
            <h3>Saldo Livre</h3>
            <p class="card-value">{formatCurrency(planejamento.saldoLivre)}</p>
            <span class="card-badge">Disponível</span>
          </div>
        </div>
      </div>

      <!-- Breakdown Section -->
      <div class="breakdown-section">
        <h2>Distribuição Financeira</h2>
        <div class="breakdown-chart">
          <div class="breakdown-item">
            <div class="breakdown-header">
              <span class="breakdown-label">Receitas</span>
              <span class="breakdown-value">{formatCurrency(planejamento.receitaTotal)}</span>
            </div>
            <div class="breakdown-bar">
              <div class="breakdown-fill income-fill" style="width: 100%"></div>
            </div>
          </div>

          <div class="breakdown-item">
            <div class="breakdown-header">
              <span class="breakdown-label">Despesas</span>
              <span class="breakdown-value">{formatCurrency(planejamento.despesaTotal)}</span>
            </div>
            <div class="breakdown-bar">
              <div class="breakdown-fill expense-fill" style="width: {despesaPercentage}%"></div>
            </div>
          </div>

          <div class="breakdown-item">
            <div class="breakdown-header">
              <span class="breakdown-label">Poupança</span>
              <span class="breakdown-value">{formatCurrency(planejamento.poupancaTotal)}</span>
            </div>
            <div class="breakdown-bar">
              <div class="breakdown-fill savings-fill" style="width: {poupancaPercentage}%"></div>
            </div>
          </div>

          <div class="breakdown-item">
            <div class="breakdown-header">
              <span class="breakdown-label">Saldo Livre</span>
              <span class="breakdown-value">{formatCurrency(planejamento.saldoLivre)}</span>
            </div>
            <div class="breakdown-bar">
              <div class="breakdown-fill balance-fill" style="width: {(planejamento.saldoLivre / planejamento.receitaTotal) * 100}%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Health -->
      <div class="health-section">
        <h2>Saúde Financeira</h2>
        <div class="health-indicators">
          <div class="health-item">
            <div class="health-icon">✅</div>
            <div class="health-content">
              <h4>Taxa de Poupança</h4>
              <p>{poupancaPercentage.toFixed(1)}% da receita</p>
              <span class="health-status good">Saudável</span>
            </div>
          </div>

          <div class="health-item">
            <div class="health-icon">{despesaPercentage > 70 ? '⚠️' : '✅'}</div>
            <div class="health-content">
              <h4>Taxa de Despesas</h4>
              <p>{despesaPercentage.toFixed(1)}% da receita</p>
              <span class="health-status {despesaPercentage > 70 ? 'warning' : 'good'}">
                {despesaPercentage > 70 ? 'Atenção' : 'Controlado'}
              </span>
            </div>
          </div>

          <div class="health-item">
            <div class="health-icon">{planejamento.saldoLivre > 0 ? '✅' : '❌'}</div>
            <div class="health-content">
              <h4>Saldo Disponível</h4>
              <p>{formatCurrency(planejamento.saldoLivre)}</p>
              <span class="health-status {planejamento.saldoLivre > 0 ? 'good' : 'bad'}">
                {planejamento.saldoLivre > 0 ? 'Positivo' : 'Negativo'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .planning-page {
    max-width: 1400px;
    margin: 0 auto;
  }

  .dashboard-header {
    margin-bottom: 30px;
  }

  .dashboard-title {
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(90deg, #1a2542, #4169e1);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .dashboard-subtitle {
    font-size: 15px;
    color: #8a94a6;
    margin-top: 5px;
  }

  .loading, .error {
    text-align: center;
    padding: 3rem;
    font-size: 1.1rem;
  }

  .error {
    color: #e53935;
  }

  .planning-grid {
    display: grid;
    gap: 30px;
  }

  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .summary-card {
    background: white;
    border-radius: 16px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    gap: 20px;
    transition: transform 0.3s;
    position: relative;
    overflow: hidden;
  }

  .summary-card::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
  }

  .summary-card.income::before {
    background: linear-gradient(90deg, #43a047, #00796b);
  }

  .summary-card.expense::before {
    background: linear-gradient(90deg, #e53935, #b71c1c);
  }

  .summary-card.savings::before {
    background: linear-gradient(90deg, #4169e1, #1e88e5);
  }

  .summary-card.balance::before {
    background: linear-gradient(90deg, #ff9800, #f57c00);
  }

  .summary-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  .card-icon {
    font-size: 40px;
  }

  .card-content h3 {
    font-size: 15px;
    font-weight: 500;
    color: #8a94a6;
    margin: 0 0 10px 0;
  }

  .card-value {
    font-size: 24px;
    font-weight: 700;
    margin: 0 0 10px 0;
    color: #1a2542;
  }

  .card-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    background-color: rgba(65, 105, 225, 0.1);
    color: #4169e1;
  }

  .breakdown-section, .health-section {
    background: white;
    border-radius: 16px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .breakdown-section h2, .health-section h2 {
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 20px 0;
    color: #1a2542;
  }

  .breakdown-chart {
    display: grid;
    gap: 20px;
  }

  .breakdown-item {
    display: grid;
    gap: 10px;
  }

  .breakdown-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .breakdown-label {
    font-weight: 500;
    color: #1a2542;
  }

  .breakdown-value {
    font-weight: 600;
    color: #4169e1;
  }

  .breakdown-bar {
    height: 12px;
    background-color: #f0f5ff;
    border-radius: 6px;
    overflow: hidden;
  }

  .breakdown-fill {
    height: 100%;
    border-radius: 6px;
    transition: width 0.3s ease;
  }

  .income-fill {
    background: linear-gradient(90deg, #43a047, #00796b);
  }

  .expense-fill {
    background: linear-gradient(90deg, #e53935, #b71c1c);
  }

  .savings-fill {
    background: linear-gradient(90deg, #4169e1, #1e88e5);
  }

  .balance-fill {
    background: linear-gradient(90deg, #ff9800, #f57c00);
  }

  .health-indicators {
    display: grid;
    gap: 20px;
  }

  .health-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: #f6f8ff;
    border-radius: 12px;
  }

  .health-icon {
    font-size: 32px;
  }

  .health-content h4 {
    margin: 0 0 5px 0;
    font-size: 15px;
    font-weight: 600;
    color: #1a2542;
  }

  .health-content p {
    margin: 0 0 8px 0;
    color: #8a94a6;
    font-size: 14px;
  }

  .health-status {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  .health-status.good {
    background-color: rgba(67, 160, 71, 0.1);
    color: #43a047;
  }

  .health-status.warning {
    background-color: rgba(255, 152, 0, 0.1);
    color: #ff9800;
  }

  .health-status.bad {
    background-color: rgba(229, 57, 53, 0.1);
    color: #e53935;
  }
</style>

