export const categories = [
  { id: '1', name: 'Eletrônicos' },
  { id: '2', name: 'Escritório' },
  { id: '3', name: 'Casa' },
];

export const products = [
  { id: '1', name: 'Teclado sem fio', categoryId: '1', stock: 24, minimumStock: 8 },
  { id: '2', name: 'Caderno pautado', categoryId: '2', stock: 42, minimumStock: 12 },
  { id: '3', name: 'Luminária de mesa', categoryId: '3', stock: 7, minimumStock: 10 },
  { id: '4', name: 'Mouse óptico', categoryId: '1', stock: 18, minimumStock: 6 },
];

export const movements = [
  { id: '1', productId: '1', type: 'ENTRADA', quantity: 12, date: 'Hoje, 09:40' },
  { id: '2', productId: '3', type: 'SAIDA', quantity: 3, date: 'Ontem, 16:20' },
  { id: '3', productId: '2', type: 'ENTRADA', quantity: 20, date: '12/08/2026, 11:15' },
  { id: '4', productId: '4', type: 'SAIDA', quantity: 2, date: '11/08/2026, 14:05' },
];
