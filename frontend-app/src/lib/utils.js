// Currency formatting
export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0);
}

// Date formatting
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR');
}

// Parse date for input fields (YYYY-MM-DD format)
export function formatDateForInput(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

// Calculate percentage
export function calculatePercentage(current, total) {
  if (!total || total === 0) return 0;
  return Math.min((current / total) * 100, 100);
}

// Enum translations
export const TipoPagamentoCartao = {
  DEBITO: 'Débito',
  CREDITO: 'Crédito',
  DEBITO_E_CREDITO: 'Débito e Crédito'
};

