<script>
  import { onMount } from 'svelte';
  import api from '../lib/services/api.js';
  import Modal from '../lib/components/Modal.svelte';
  import { formatCurrency, TipoPagamentoCartao } from '../lib/utils.js';

  let cartoes = [];
  let bancos = [];
  let loading = true;
  let showModal = false;
  let formData = {
    nome: '',
    tipoPagamentoCartao: 'CREDITO',
    limite: '',
    bandeira: '',
    numero: '',
    diaVencimentoFatura: '',
    bancoEmissor: null
  };

  onMount(async () => {
    await loadData();
  });

  async function loadData() {
    try {
      loading = true;
      const [cartoesData, bancosData] = await Promise.all([
        api.getCartoes(),
        api.getBancos()
      ]);
      cartoes = cartoesData;
      bancos = bancosData;
    } catch (err) {
      console.error('Error loading cards:', err);
      alert('Erro ao carregar cartões: ' + err.message);
    } finally {
      loading = false;
    }
  }

  function openModal() {
    formData = {
      nome: '',
      tipoPagamentoCartao: 'CREDITO',
      limite: '',
      bandeira: '',
      numero: '',
      diaVencimentoFatura: '',
      bancoEmissor: null
    };
    showModal = true;
  }

  function closeModal() {
    showModal = false;
  }

  async function handleSubmit() {
    try {
      const cartao = {
        ...formData,
        limite: parseFloat(formData.limite),
        diaVencimentoFatura: parseInt(formData.diaVencimentoFatura),
        bancoEmissor: formData.bancoEmissor ? { id: formData.bancoEmissor } : null
      };
      
      await api.createCartao(cartao);
      await loadData();
      closeModal();
    } catch (err) {
      console.error('Error creating card:', err);
      alert('Erro ao criar cartão: ' + err.message);
    }
  }

  async function deleteCard(id) {
    if (!confirm('Tem certeza que deseja excluir este cartão?')) return;
    
    try {
      await api.deleteCartao(id);
      await loadData();
    } catch (err) {
      console.error('Error deleting card:', err);
      alert('Erro ao excluir cartão: ' + err.message);
    }
  }
</script>

<div class="cards-page">
  <div class="page-header">
    <h1>💳 Cartões</h1>
    <button class="btn-primary" on:click={openModal}>+ Novo Cartão</button>
  </div>

  {#if loading}
    <div class="loading">Carregando...</div>
  {:else if cartoes.length === 0}
    <div class="empty-state">
      <p>Nenhum cartão cadastrado</p>
      <button class="btn-primary" on:click={openModal}>Cadastrar Primeiro Cartão</button>
    </div>
  {:else}
    <div class="cards-grid">
      {#each cartoes as cartao}
        <div class="card-item">
          <div class="card-header">
            <h3>{cartao.nome}</h3>
            <button class="btn-delete" on:click={() => deleteCard(cartao.id)}>🗑️</button>
          </div>
          <div class="card-details">
            <div class="detail-row">
              <span class="label">Bandeira:</span>
              <span class="value">{cartao.bandeira}</span>
            </div>
            <div class="detail-row">
              <span class="label">Número:</span>
              <span class="value">**** {cartao.numero?.slice(-4) || '****'}</span>
            </div>
            <div class="detail-row">
              <span class="label">Tipo:</span>
              <span class="value">{TipoPagamentoCartao[cartao.tipoPagamentoCartao]}</span>
            </div>
            <div class="detail-row">
              <span class="label">Limite:</span>
              <span class="value">{formatCurrency(cartao.limite)}</span>
            </div>
            <div class="detail-row">
              <span class="label">Vencimento:</span>
              <span class="value">Dia {cartao.diaVencimentoFatura}</span>
            </div>
            {#if cartao.bancoEmissor}
              <div class="detail-row">
                <span class="label">Banco:</span>
                <span class="value">{cartao.bancoEmissor.nome}</span>
              </div>
            {/if}
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>

<Modal bind:isOpen={showModal} title="Novo Cartão" on:close={closeModal}>
  <form id="card-form" on:submit|preventDefault={handleSubmit}>
    <div class="form-group">
      <label for="nome">Nome do Cartão *</label>
      <input 
        type="text" 
        id="nome" 
        bind:value={formData.nome} 
        required 
        placeholder="Ex: Cartão Principal"
      />
    </div>

    <div class="form-group">
      <label for="bandeira">Bandeira *</label>
      <input 
        type="text" 
        id="bandeira" 
        bind:value={formData.bandeira} 
        required 
        placeholder="Ex: Visa, Mastercard"
      />
    </div>

    <div class="form-group">
      <label for="numero">Número do Cartão *</label>
      <input 
        type="text" 
        id="numero" 
        bind:value={formData.numero} 
        required 
        placeholder="0000 0000 0000 0000"
      />
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="tipo">Tipo *</label>
        <select id="tipo" bind:value={formData.tipoPagamentoCartao} required>
          <option value="DEBITO">Débito</option>
          <option value="CREDITO">Crédito</option>
          <option value="DEBITO_E_CREDITO">Débito e Crédito</option>
        </select>
      </div>

      <div class="form-group">
        <label for="limite">Limite *</label>
        <input 
          type="number" 
          id="limite" 
          bind:value={formData.limite} 
          required 
          step="0.01"
          placeholder="0.00"
        />
      </div>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="vencimento">Dia Vencimento *</label>
        <input 
          type="number" 
          id="vencimento" 
          bind:value={formData.diaVencimentoFatura} 
          required 
          min="1"
          max="31"
          placeholder="1-31"
        />
      </div>

      <div class="form-group">
        <label for="banco">Banco</label>
        <select id="banco" bind:value={formData.bancoEmissor}>
          <option value={null}>Selecione um banco</option>
          {#each bancos as banco}
            <option value={banco.id}>{banco.nome}</option>
          {/each}
        </select>
      </div>
    </div>
  </form>

  <div slot="footer" class="modal-actions">
    <button type="button" class="btn-secondary" on:click={closeModal}>Cancelar</button>
    <button type="submit" form="card-form" class="btn-primary">Salvar</button>
  </div>
</Modal>

<style>
  .cards-page {
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

  .empty-state p {
    color: #718096;
    margin-bottom: 1rem;
  }

  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .card-item {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s;
  }

  .card-item:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e2e8f0;
  }

  .card-header h3 {
    margin: 0;
    color: #2d3748;
  }

  .card-details {
    display: grid;
    gap: 0.75rem;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
  }

  .label {
    color: #718096;
    font-size: 0.9rem;
  }

  .value {
    color: #2d3748;
    font-weight: 500;
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

