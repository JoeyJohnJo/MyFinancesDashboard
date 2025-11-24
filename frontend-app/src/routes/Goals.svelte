<script>
  import { onMount } from 'svelte';
  import api from '../lib/services/api.js';
  import Modal from '../lib/components/Modal.svelte';
  import { formatCurrency, calculatePercentage } from '../lib/utils.js';

  let metas = [];
  let loading = true;
  let showModal = false;
  let formData = { nome: '', valorObjetivo: '', valorAlcancado: '', descricao: '' };

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    try {
      loading = true;
      metas = await api.getMetas();
    } catch (err) {
      console.error('Error loading goals:', err);
      alert('Erro ao carregar metas: ' + err.message);
    } finally {
      loading = false;
    }
  }

  function openModal() {
    formData = { nome: '', valorObjetivo: '', valorAlcancado: '0', descricao: '' };
    showModal = true;
  }

  async function handleSubmit() {
    try {
      const meta = {
        ...formData,
        valorObjetivo: parseFloat(formData.valorObjetivo),
        valorAlcancado: parseFloat(formData.valorAlcancado)
      };
      await api.createMeta(meta);
      await loadData();
      showModal = false;
    } catch (err) {
      console.error('Error creating goal:', err);
      alert('Erro ao criar meta: ' + err.message);
    }
  }

  async function deleteMeta(id) {
    if (!confirm('Tem certeza que deseja excluir esta meta?')) return;
    try {
      await api.deleteMeta(id);
      await loadData();
    } catch (err) {
      console.error('Error deleting goal:', err);
      alert('Erro ao excluir meta: ' + err.message);
    }
  }

  async function updateProgress(meta) {
    const valor = prompt('Digite o valor a adicionar:', '0');
    if (!valor) return;
    
    try {
      const updatedMeta = {
        ...meta,
        valorAlcancado: meta.valorAlcancado + parseFloat(valor)
      };
      await api.updateMeta(updatedMeta);
      await loadData();
    } catch (err) {
      console.error('Error updating goal:', err);
      alert('Erro ao atualizar meta: ' + err.message);
    }
  }
</script>

<div class="goals-page">
  <div class="page-header">
    <h1>🎯 Metas Financeiras</h1>
    <button class="btn-primary" on:click={openModal}>+ Nova Meta</button>
  </div>

  {#if loading}
    <div class="loading">Carregando...</div>
  {:else if metas.length === 0}
    <div class="empty-state">
      <p>Nenhuma meta cadastrada</p>
      <button class="btn-primary" on:click={openModal}>Cadastrar Primeira Meta</button>
    </div>
  {:else}
    <div class="goals-grid">
      {#each metas as meta}
        <div class="goal-card">
          <div class="goal-header">
            <h3>{meta.nome}</h3>
            <button class="btn-delete" on:click={() => deleteMeta(meta.id)}>🗑️</button>
          </div>
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
          <button class="btn-add" on:click={() => updateProgress(meta)}>+ Adicionar Valor</button>
        </div>
      {/each}
    </div>
  {/if}
</div>

<Modal bind:isOpen={showModal} title="Nova Meta" on:close={() => showModal = false}>
  <form id="goal-form" on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="nome">Nome da Meta *</label>
      <input type="text" id="nome" bind:value={formData.nome} required placeholder="Ex: Viagem" />
    </div>

    <div class="form-group">
      <label for="descricao">Descrição</label>
      <textarea id="descricao" bind:value={formData.descricao} placeholder="Descrição opcional" rows="3"></textarea>
    </div>

    <div class="form-group">
      <label for="objetivo">Valor Objetivo *</label>
      <input type="number" id="objetivo" bind:value={formData.valorObjetivo} required step="0.01" placeholder="0.00" />
    </div>

    <div class="form-group">
      <label for="alcancado">Valor Já Alcançado</label>
      <input type="number" id="alcancado" bind:value={formData.valorAlcancado} step="0.01" placeholder="0.00" />
    </div>
  </form>

  <div slot="footer" class="modal-actions">
    <button type="button" class="btn-secondary" on:click={() => showModal = false}>Cancelar</button>
    <button type="submit" form="goal-form" class="btn-primary">Salvar</button>
  </div>
</Modal>

<style>
  .goals-page {
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

  .goals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .goal-card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }

  .goal-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .goal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .goal-header h3 {
    margin: 0;
    color: #2d3748;
  }

  .goal-description {
    color: #718096;
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .progress-bar {
    height: 12px;
    background: #e2e8f0;
    border-radius: 6px;
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
    font-weight: 700;
    font-size: 1.25rem;
    color: #667eea;
    margin-bottom: 1rem;
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

  input, textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    font-size: 1rem;
    font-family: inherit;
  }

  input:focus, textarea:focus {
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

