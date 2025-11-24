<script>
  import { onMount } from 'svelte';
  import api from '../lib/services/api.js';
  import Modal from '../lib/components/Modal.svelte';
  import { formatCurrency, formatDate, formatDateForInput } from '../lib/utils.js';

  let receitas = [];
  let loading = true;
  let showModal = false;
  let formData = { nome: '', valorReceita: '', dataReceita: '' };

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    try {
      loading = true;
      receitas = await api.getReceitas();
    } catch (err) {
      console.error('Error loading receitas:', err);
      alert('Erro ao carregar receitas: ' + err.message);
    } finally {
      loading = false;
    }
  }

  function openModal() {
    formData = { nome: '', valorReceita: '', dataReceita: new Date().toISOString().split('T')[0] };
    showModal = true;
  }

  async function handleSubmit() {
    try {
      const receita = {
        ...formData,
        valorReceita: parseFloat(formData.valorReceita)
      };
      await api.createReceita(receita);
      await loadData();
      showModal = false;
    } catch (err) {
      console.error('Error creating receita:', err);
      alert('Erro ao criar receita: ' + err.message);
    }
  }

  async function deleteReceita(id) {
    if (!confirm('Tem certeza que deseja excluir esta receita?')) return;
    try {
      await api.deleteReceita(id);
      await loadData();
    } catch (err) {
      console.error('Error deleting receita:', err);
      alert('Erro ao excluir receita: ' + err.message);
    }
  }

  $: totalReceitas = receitas.reduce((sum, r) => sum + (r.valorReceita || 0), 0);
</script>

<div class="receitas-page">
  <div class="page-header">
    <h1>💰 Receitas</h1>
    <button class="btn-primary" on:click={openModal}>+ Nova Receita</button>
  </div>

  <div class="total-card">
    <h3>Total de Receitas</h3>
    <p class="total-value">{formatCurrency(totalReceitas)}</p>
  </div>

  {#if loading}
    <div class="loading">Carregando...</div>
  {:else if receitas.length === 0}
    <div class="empty-state">
      <p>Nenhuma receita cadastrada</p>
      <button class="btn-primary" on:click={openModal}>Cadastrar Primeira Receita</button>
    </div>
  {:else}
    <div class="receitas-list">
      {#each receitas as receita}
        <div class="receita-item">
          <div class="receita-info">
            <h3>{receita.nome}</h3>
            <span class="receita-date">{formatDate(receita.dataReceita)}</span>
          </div>
          <div class="receita-actions">
            <span class="receita-value">{formatCurrency(receita.valorReceita)}</span>
            <button class="btn-delete" on:click={() => deleteReceita(receita.id)}>🗑️</button>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<Modal bind:isOpen={showModal} title="Nova Receita" on:close={() => showModal = false}>
  <form id="receita-form" on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="nome">Nome *</label>
      <input type="text" id="nome" bind:value={formData.nome} required placeholder="Ex: Salário" />
    </div>

    <div class="form-group">
      <label for="valor">Valor *</label>
      <input type="number" id="valor" bind:value={formData.valorReceita} required step="0.01" placeholder="0.00" />
    </div>

    <div class="form-group">
      <label for="data">Data *</label>
      <input type="date" id="data" bind:value={formData.dataReceita} required />
    </div>
  </form>

  <div slot="footer" class="modal-actions">
    <button type="button" class="btn-secondary" on:click={() => showModal = false}>Cancelar</button>
    <button type="submit" form="receita-form" class="btn-primary">Salvar</button>
  </div>
</Modal>

<style>
  .receitas-page {
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
    background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
    color: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    margin-bottom: 2rem;
    box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
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

  .receitas-list {
    display: grid;
    gap: 1rem;
  }

  .receita-item {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }

  .receita-item:hover {
    transform: translateX(4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .receita-info h3 {
    margin: 0 0 0.25rem 0;
    color: #2d3748;
  }

  .receita-date {
    color: #718096;
    font-size: 0.9rem;
  }

  .receita-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .receita-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #48bb78;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #2d3748;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 1rem;
  }

  input:focus {
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

