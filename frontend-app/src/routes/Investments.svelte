<script>
  import { onMount } from 'svelte';
  import api from '../lib/services/api.js';
  import Modal from '../lib/components/Modal.svelte';
  import { formatCurrency, formatDate } from '../lib/utils.js';

  let investimentos = [];
  let loading = true;
  let showInvModal = false;
  let showAplModal = false;
  let selectedInv = null;
  let invFormData = { nome: '' };
  let aplFormData = { valorAplicado: '', dataAplicacao: '' };

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    try {
      loading = true;
      investimentos = await api.getInvestimentos();
    } catch (err) {
      console.error('Error loading investments:', err);
      alert('Erro ao carregar investimentos: ' + err.message);
    } finally {
      loading = false;
    }
  }

  function openInvModal() {
    invFormData = { nome: '' };
    showInvModal = true;
  }

  function openAplModal(inv) {
    selectedInv = inv;
    aplFormData = { valorAplicado: '', dataAplicacao: new Date().toISOString().split('T')[0] };
    showAplModal = true;
  }

  async function handleInvSubmit() {
    try {
      await api.createInvestimento(invFormData);
      await loadData();
      showInvModal = false;
    } catch (err) {
      console.error('Error creating investment:', err);
      alert('Erro ao criar investimento: ' + err.message);
    }
  }

  async function handleAplSubmit() {
    try {
      const aplicacao = {
        valorAplicado: parseFloat(aplFormData.valorAplicado),
        dataAplicacao: aplFormData.dataAplicacao,
        investimento: { id: selectedInv.id }
      };
      await api.createAplicacao(aplicacao);
      await loadData();
      showAplModal = false;
    } catch (err) {
      console.error('Error creating application:', err);
      alert('Erro ao criar aplicação: ' + err.message);
    }
  }

  async function deleteInvestimento(id) {
    if (!confirm('Tem certeza que deseja excluir este investimento?')) return;
    try {
      await api.deleteInvestimento(id);
      await loadData();
    } catch (err) {
      console.error('Error deleting investment:', err);
      alert('Erro ao excluir investimento: ' + err.message);
    }
  }

  $: totalInvestido = investimentos.reduce((sum, inv) => sum + (inv.totalInvestido || 0), 0);
</script>

<div class="investments-page">
  <div class="page-header">
    <h1>📈 Investimentos</h1>
    <button class="btn-primary" on:click={openInvModal}>+ Novo Investimento</button>
  </div>

  <div class="total-card">
    <h3>Total Investido</h3>
    <p class="total-value">{formatCurrency(totalInvestido)}</p>
  </div>

  {#if loading}
    <div class="loading">Carregando...</div>
  {:else if investimentos.length === 0}
    <div class="empty-state">
      <p>Nenhum investimento cadastrado</p>
      <button class="btn-primary" on:click={openInvModal}>Cadastrar Primeiro Investimento</button>
    </div>
  {:else}
    <div class="investments-grid">
      {#each investimentos as inv}
        <div class="investment-card">
          <div class="inv-header">
            <h3>{inv.nome}</h3>
            <button class="btn-delete" on:click={() => deleteInvestimento(inv.id)}>🗑️</button>
          </div>
          <div class="inv-total">
            <span class="label">Total Investido</span>
            <span class="value">{formatCurrency(inv.totalInvestido)}</span>
          </div>
          <div class="inv-applications">
            <h4>Aplicações ({inv.aplicacoes?.length || 0})</h4>
            {#if inv.aplicacoes && inv.aplicacoes.length > 0}
              <div class="apl-list">
                {#each inv.aplicacoes as apl}
                  <div class="apl-item">
                    <span>{formatDate(apl.dataAplicacao)}</span>
                    <span>{formatCurrency(apl.valorAplicado)}</span>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
          <button class="btn-add" on:click={() => openAplModal(inv)}>+ Nova Aplicação</button>
        </div>
      {/each}
    </div>
  {/if}
</div>

<Modal bind:isOpen={showInvModal} title="Novo Investimento" on:close={() => showInvModal = false}>
  <form id="inv-form" on:submit|preventDefault={handleInvSubmit}>
    <div class="form-group">
      <label for="nome">Nome do Investimento *</label>
      <input type="text" id="nome" bind:value={invFormData.nome} required placeholder="Ex: Tesouro Direto" />
    </div>
  </form>

  <div slot="footer" class="modal-actions">
    <button type="button" class="btn-secondary" on:click={() => showInvModal = false}>Cancelar</button>
    <button type="submit" form="inv-form" class="btn-primary">Salvar</button>
  </div>
</Modal>

<Modal bind:isOpen={showAplModal} title="Nova Aplicação" on:close={() => showAplModal = false}>
  <form id="apl-form" on:submit|preventDefault={handleAplSubmit}>
    <div class="form-group">
      <label for="valor">Valor *</label>
      <input type="number" id="valor" bind:value={aplFormData.valorAplicado} required step="0.01" placeholder="0.00" />
    </div>

    <div class="form-group">
      <label for="data">Data *</label>
      <input type="date" id="data" bind:value={aplFormData.dataAplicacao} required />
    </div>
  </form>

  <div slot="footer" class="modal-actions">
    <button type="button" class="btn-secondary" on:click={() => showAplModal = false}>Cancelar</button>
    <button type="submit" form="apl-form" class="btn-primary">Salvar</button>
  </div>
</Modal>

<style>
  .investments-page {
    max-width: 1400px;
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    border-radius: 12px;
    text-align: center;
    margin-bottom: 2rem;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
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

  .investments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .investment-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }

  .investment-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .inv-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e2e8f0;
  }

  .inv-header h3 {
    margin: 0;
    color: #2d3748;
  }

  .inv-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: #f7fafc;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .inv-total .label {
    color: #718096;
  }

  .inv-total .value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #667eea;
  }

  .inv-applications h4 {
    margin: 0 0 0.75rem 0;
    color: #2d3748;
    font-size: 0.9rem;
  }

  .apl-list {
    display: grid;
    gap: 0.5rem;
    margin-bottom: 1rem;
    max-height: 150px;
    overflow-y: auto;
  }

  .apl-item {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;
    background: #f7fafc;
    border-radius: 4px;
    font-size: 0.9rem;
  }

  .btn-add {
    width: 100%;
    padding: 0.75rem;
    background: #f7fafc;
    border: 2px dashed #cbd5e0;
    border-radius: 6px;
    color: #667eea;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-add:hover {
    background: #edf2f7;
    border-color: #667eea;
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

