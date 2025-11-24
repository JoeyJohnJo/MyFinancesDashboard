<script>
  import { onMount } from 'svelte';
  import api from '../lib/services/api.js';
  import Modal from '../lib/components/Modal.svelte';
  import { formatCurrency, formatDate } from '../lib/utils.js';

  let despesas = [];
  let cartoes = [];
  let loading = true;
  let showModal = false;
  let formData = { descricao: '', valor: '', parcelas: '1', vencimento: '', cartaoUsado: null };

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    try {
      loading = true;
      const [despesasData, cartoesData] = await Promise.all([
        api.getDespesas(),
        api.getCartoes()
      ]);
      despesas = despesasData;
      cartoes = cartoesData;
    } catch (err) {
      console.error('Error loading expenses:', err);
      alert('Erro ao carregar despesas: ' + err.message);
    } finally {
      loading = false;
    }
  }

  function openModal() {
    formData = { descricao: '', valor: '', parcelas: '1', vencimento: new Date().toISOString().split('T')[0], cartaoUsado: null };
    showModal = true;
  }

  async function handleSubmit() {
    try {
      const despesa = {
        ...formData,
        valor: parseFloat(formData.valor),
        parcelas: parseInt(formData.parcelas),
        cartaoUsado: formData.cartaoUsado ? { id: formData.cartaoUsado } : null
      };
      await api.createDespesa(despesa);
      await loadData();
      showModal = false;
    } catch (err) {
      console.error('Error creating expense:', err);
      alert('Erro ao criar despesa: ' + err.message);
    }
  }

  async function deleteDespesa(id) {
    if (!confirm('Tem certeza que deseja excluir esta despesa?')) return;
    try {
      await api.deleteDespesa(id);
      await loadData();
    } catch (err) {
      console.error('Error deleting expense:', err);
      alert('Erro ao excluir despesa: ' + err.message);
    }
  }

  $: totalDespesas = despesas.reduce((sum, d) => sum + (d.valor || 0), 0);
</script>

<div class="expenses-page">
  <div class="page-header">
    <h1>💸 Despesas</h1>
    <button class="btn-primary" on:click={openModal}>+ Nova Despesa</button>
  </div>

  <div class="total-card">
    <h3>Total de Despesas</h3>
    <p class="total-value">{formatCurrency(totalDespesas)}</p>
  </div>

  {#if loading}
    <div class="loading">Carregando...</div>
  {:else if despesas.length === 0}
    <div class="empty-state">
      <p>Nenhuma despesa cadastrada</p>
      <button class="btn-primary" on:click={openModal}>Cadastrar Primeira Despesa</button>
    </div>
  {:else}
    <div class="expenses-list">
      {#each despesas as despesa}
        <div class="expense-item">
          <div class="expense-info">
            <h3>{despesa.descricao}</h3>
            <div class="expense-details">
              <span>{formatDate(despesa.vencimento)}</span>
              {#if despesa.parcelas > 1}
                <span>• {despesa.parcelas}x</span>
              {/if}
              {#if despesa.cartaoUsado}
                <span>• {despesa.cartaoUsado.nome}</span>
              {/if}
            </div>
          </div>
          <div class="expense-actions">
            <span class="expense-value">{formatCurrency(despesa.valor)}</span>
            <button class="btn-delete" on:click={() => deleteDespesa(despesa.id)}>🗑️</button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<Modal bind:isOpen={showModal} title="Nova Despesa" on:close={() => showModal = false}>
  <form id="expense-form" on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="descricao">Descrição *</label>
      <input type="text" id="descricao" bind:value={formData.descricao} required placeholder="Ex: Compra supermercado" />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="valor">Valor *</label>
        <input type="number" id="valor" bind:value={formData.valor} required step="0.01" placeholder="0.00" />
      </div>

      <div class="form-group">
        <label for="parcelas">Parcelas *</label>
        <input type="number" id="parcelas" bind:value={formData.parcelas} required min="1" placeholder="1" />
      </div>
    </div>

    <div class="form-group">
      <label for="vencimento">Vencimento *</label>
      <input type="date" id="vencimento" bind:value={formData.vencimento} required />
    </div>

    <div class="form-group">
      <label for="cartao">Cartão</label>
      <select id="cartao" bind:value={formData.cartaoUsado}>
        <option value={null}>Selecione um cartão</option>
        {#each cartoes as cartao}
          <option value={cartao.id}>{cartao.nome}</option>
        {/each}
      </select>
    </div>
  </form>

  <div slot="footer" class="modal-actions">
    <button type="button" class="btn-secondary" on:click={() => showModal = false}>Cancelar</button>
    <button type="submit" form="expense-form" class="btn-primary">Salvar</button>
  </div>
</Modal>

<style>
  .expenses-page {
    max-width: 1000px;
    margin: 0 auto;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  h1 {
    color: #2d3748;
    margin: 0;
  }

  .total-card {
    background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
    color: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    margin-bottom: 2rem;
    box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
  }

  .total-card h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1rem;
    opacity: 0.9;
  }

  .total-value {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
  }

  .loading, .empty-state {
    text-align: center;
    padding: 3rem;
  }

  .expenses-list {
    display: grid;
    gap: 1rem;
  }

  .expense-item {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }

  .expense-item:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .expense-info h3 {
    margin: 0 0 0.5rem 0;
    color: #2d3748;
  }

  .expense-details {
    color: #718096;
    font-size: 0.9rem;
  }

  .expense-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .expense-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #f56565;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #2d3748;
    font-weight: 500;
  }

  input, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 1rem;
  }

  input:focus, select:focus {
    outline: none;
    border-color: #667eea;
  }

  .modal-actions {
    display: flex;
    gap: 0.75rem;
  }

  .btn-primary, .btn-secondary, .btn-delete {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }

  .btn-secondary {
    background: #e2e8f0;
    color: #2d3748;
  }

  .btn-secondary:hover {
    background: #cbd5e0;
  }

  .btn-delete {
    background: none;
    padding: 0.5rem;
    font-size: 1.2rem;
  }

  .btn-delete:hover {
    background: #fed7d7;
  }
</style>

