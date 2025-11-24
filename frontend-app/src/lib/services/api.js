// API Service - Centralized backend communication
const API_BASE_URL = '/api';

class ApiService {
    constructor(baseUrl = API_BASE_URL) {
        this.baseUrl = baseUrl;
    }

    // Generic request handler
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! status: ${response.status}`);
            }

            // Handle empty responses (like DELETE)
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // ========== DESPESAS (Expenses) ==========
    async getDespesas() {
        return this.request('/despesas');
    }

    async getDespesaById(id) {
        return this.request(`/despesas/${id}`);
    }

    async createDespesa(despesa) {
        return this.request('/despesas', {
            method: 'POST',
            body: JSON.stringify(despesa),
        });
    }

    async deleteDespesa(id) {
        return this.request(`/despesas/${id}`, {
            method: 'DELETE',
        });
    }

    // ========== METAS (Goals) ==========
    async getMetas() {
        return this.request('/metas');
    }

    async getMetaById(id) {
        return this.request(`/metas/${id}`);
    }

    async createMeta(meta) {
        return this.request('/metas', {
            method: 'POST',
            body: JSON.stringify(meta),
        });
    }

    async updateMeta(meta) {
        return this.request('/metas', {
            method: 'POST',
            body: JSON.stringify(meta),
        });
    }

    async deleteMeta(id) {
        return this.request(`/metas/${id}`, {
            method: 'DELETE',
        });
    }

    // ========== INVESTIMENTOS (Investments) ==========
    async getInvestimentos() {
        return this.request('/investimentos');
    }

    async getInvestimentoById(id) {
        return this.request(`/investimentos/${id}`);
    }

    async createInvestimento(investimento) {
        return this.request('/investimentos', {
            method: 'POST',
            body: JSON.stringify(investimento),
        });
    }

    async deleteInvestimento(id) {
        return this.request(`/investimentos/${id}`, {
            method: 'DELETE',
        });
    }

    // ========== APLICAÇÕES DE INVESTIMENTO (Investment Applications) ==========
    async getAplicacoesByInvestimentoId(investimentoId) {
        return this.request(`/investimentos/${investimentoId}/aplicacoes`);
    }

    async createAplicacao(aplicacao) {
        return this.request('/aplicacoes', {
            method: 'POST',
            body: JSON.stringify(aplicacao),
        });
    }

    async deleteAplicacao(id) {
        return this.request(`/aplicacoes/${id}`, {
            method: 'DELETE',
        });
    }

    // ========== RECEITAS (Income) ==========
    async getReceitas() {
        return this.request('/receitas');
    }

    async getReceitaById(id) {
        return this.request(`/receitas/${id}`);
    }

    async createReceita(receita) {
        return this.request('/receitas', {
            method: 'POST',
            body: JSON.stringify(receita),
        });
    }

    async deleteReceita(id) {
        return this.request(`/receitas/${id}`, {
            method: 'DELETE',
        });
    }

    // ========== CARTÕES (Cards) ==========
    async getCartoes() {
        return this.request('/cartoes');
    }

    async getCartaoById(id) {
        return this.request(`/cartoes/${id}`);
    }

    async createCartao(cartao) {
        return this.request('/cartoes', {
            method: 'POST',
            body: JSON.stringify(cartao),
        });
    }

    async deleteCartao(id) {
        return this.request(`/cartoes/${id}`, {
            method: 'DELETE',
        });
    }

    // ========== BANCOS (Banks) ==========
    async getBancos() {
        return this.request('/bancos');
    }

    async getBancoById(id) {
        return this.request(`/bancos/${id}`);
    }

    async createBanco(banco) {
        return this.request('/bancos', {
            method: 'POST',
            body: JSON.stringify(banco),
        });
    }

    async deleteBanco(id) {
        return this.request(`/bancos/${id}`, {
            method: 'DELETE',
        });
    }

    // ========== PLANEJAMENTO (Financial Planning) ==========
    async getPlanejamento() {
        return this.request('/planejamento');
    }
}

// Create a singleton instance
export const api = new ApiService();
export default api;

