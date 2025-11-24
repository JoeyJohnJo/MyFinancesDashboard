<script>
  import { onMount } from 'svelte';
  import api from '../lib/services/api.js';
  import Modal from '../lib/components/Modal.svelte';

  let bancos = [];
  let loading = true;
  let showModal = false;
  let formData = { nome: '', codigo: '' };

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    try {
      loading = true;
      bancos = await api.getBancos();
    } catch (err) {
      console.error('Error loading banks:', err);
      alert('Erro ao carregar bancos: ' + err.message);
    } finally {
      loading = false;
    }
  }

  function openModal() {
    formData = { nome: '', codigo: '' };
    showModal = true;
  }

  async function handleSubmit() {
    try {
      await api.createBanco(formData);
      await loadData();
      showModal = false;
    } catch (err) {
      console.error('Error creating bank:', err);
      alert('Erro ao criar banco: ' + err.message);
    }
  }

  async function deleteBank(id) {
    if (!confirm('Tem certeza que deseja excluir este banco?')) return;
    try {
      await api.deleteBanco(id);
      await loadData();
    } catch (err) {
      console.error('Error deleting bank:', err);
      alert('Erro ao excluir banco: ' + err.message);
    }
  }
</script>

<div class="banks-page">
  <div class="page-header">
    <h1>🏦 Bancos</h1>
    <button class="btn-primary" on:click={openModal}>+ Novo Banco</button>
  </div>

  {#if loading}
    <div class="loading">Carregando...</div>
  {:else if bancos.length === 0}
    <div class="empty-state">
      <p>Nenhum banco cadastrado</p>
      <button class="btn-primary" on:click={openModal}>Cadastrar Primeiro Banco</button>
    </div>
  {:else}
    <div class="banks-grid">
      {#each bancos as banco}
        <div class="bank-item">
          <div class="bank-header">
            <h3>{banco.nome}</h3>
            <button class="btn-delete" on:click={() => deleteBank(banco.id)}>🗑️</button>
          </div>
          <div class="bank-code">Código: {banco.codigo}</div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<Modal bind:isOpen={showModal} title="Novo Banco" on:close={() => showModal = false}>
  <form id="banco-form" on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="nome">Nome do Banco *</label>
      <input type="text" id="nome" bind:value={formData.nome} required placeholder="Ex: Banco do Brasil" />
    </div>

    <div class="form-group">
      <label for="codigo">Código *</label>
      <input type="text" id="codigo" bind:value={formData.codigo} required placeholder="Ex: 001" />
    </div>
  </form>

  <div slot="footer" class="modal-actions">
    <button type="button" class="btn-secondary" on:click={() => showModal = false}>Cancelar</button>
    <button type="submit" form="banco-form" class="btn-primary">Salvar</button>
  </div>
</Modal>

<style>
  .banks-page {
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

  .loading, .empty-state {
    text-align: center;
    padding: 3rem;
  }

  .banks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  .bank-item {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }

  .bank-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .bank-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .bank-header h3 {
    margin: 0;
    color: #2d3748;
  }

  .bank-code {
    color: #718096;
    font-size: 0.9rem;
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

