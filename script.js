// Carrega as transações salvas do localStorage
let entradas = JSON.parse(localStorage.getItem('entradas')) || [];
let saidas = JSON.parse(localStorage.getItem('saidas')) || [];

document.getElementById('fixo').addEventListener('change', (e) => {
  const parcelasField = document.getElementById('parcelas');
  if (e.target.value === 'fixo') {
    parcelasField.style.display = 'block';
  } else {
    parcelasField.style.display = 'none';
    parcelasField.value = ''; // Reset parcelas se não for fixo
  }
});

function atualizarResumo() {
  const totalEntradas = entradas.reduce((total, entrada) => total + entrada.valor, 0);
  const totalSaidas = saidas.filter(item => item.pago).reduce((total, saida) => total + saida.valor, 0);
  const saldoTotal = totalEntradas - totalSaidas;

  // Atualizando os valores na interface
  document.getElementById('total-entradas').textContent = `R$ ${totalEntradas.toFixed(2)}`;
  document.getElementById('total-saidas').textContent = `R$ ${totalSaidas.toFixed(2)}`;
  document.getElementById('saldo-total').textContent = `R$ ${saldoTotal.toFixed(2)}`;
}

function adicionarTransacao() {
  const descricao = document.getElementById('descricao').value;
  const valor = parseFloat(document.getElementById('valor').value);
  const dataVencimento = document.getElementById('data-vencimento').value;
  const fixo = document.getElementById('fixo').value;
  const parcelas = fixo === 'fixo' ? parseInt(document.getElementById('parcelas').value) : 1;
  const tipo = document.getElementById('tipo').value;

  if (!descricao || !valor || !dataVencimento) {
    alert("Preencha todos os campos!");
    return;
  }

  const transacao = { descricao, valor, dataVencimento, fixo, parcelas, tipo, pago: tipo === 'entrada' };

  if (tipo === 'entrada') {
    entradas.push(transacao);
  } else {
    saidas.push(transacao);
  }

  // Atualiza os dados no localStorage
  localStorage.setItem('entradas', JSON.stringify(entradas));
  localStorage.setItem('saidas', JSON.stringify(saidas));

  // Atualiza a interface
  atualizarResumo();
  renderizarTransacoes();
  limparCampos();
}

function renderizarTransacoes() {
  const lista = document.getElementById('lista-transacoes');
  lista.innerHTML = ''; // Limpa a lista de transações

  // Renderiza entradas
  entradas.forEach((transacao, index) => {
    const item = document.createElement('div');
    item.classList.add('entry-item');
    item.innerHTML = `
      <div>${transacao.descricao}</div>
      <div>R$ ${transacao.valor.toFixed(2)}</div>
      <div>${transacao.dataVencimento}</div>
      <div>${transacao.fixo === 'fixo' ? `Fixo (${transacao.parcelas}x)` : 'Não Fixo'}</div>
      <div class="entry-actions">
        ${transacao.tipo === 'saida' ? `<button class="pay-btn" onclick="marcarComoPago(${index}, 'saida')">${transacao.pago ? "Pago" : "Pagar"}</button>` : ''}
        <button class="delete-btn" onclick="excluirTransacao(${index}, '${transacao.tipo}')">Excluir</button>
      </div>
    `;
    lista.appendChild(item);
  });

  // Renderiza saídas
  saidas.forEach((transacao, index) => {
    const item = document.createElement('div');
    item.classList.add('entry-item');
    item.innerHTML = `
      <div>${transacao.descricao}</div>
      <div>R$ ${transacao.valor.toFixed(2)}</div>
      <div>${transacao.dataVencimento}</div>
      <div>${transacao.fixo === 'fixo' ? `Fixo (${transacao.parcelas}x)` : 'Não Fixo'}</div>
      <div class="entry-actions">
        <button class="pay-btn" onclick="marcarComoPago(${index}, 'saida')">${transacao.pago ? "Pago" : "Pagar"}</button>
        <button class="delete-btn" onclick="excluirTransacao(${index}, 'saida')">Excluir</button>
      </div>
    `;
    lista.appendChild(item);
  });
}

function marcarComoPago(index, tipo) {
  let transacao;

  if (tipo === 'saida') {
    transacao = saidas[index];
  }

  // Verifica se a transação é uma saída e se ela ainda não foi paga
  if (transacao && !transacao.pago) {
    transacao.pago = true;

    // Atualiza os dados no localStorage
    localStorage.setItem('entradas', JSON.stringify(entradas));
    localStorage.setItem('saidas', JSON.stringify(saidas));

    // Atualiza a interface e os totais
    atualizarResumo();
    renderizarTransacoes();
  }
}

function excluirTransacao(index, tipo) {
  if (tipo === 'entrada') {
    entradas.splice(index, 1);
  } else {
    saidas.splice(index, 1);
  }

  // Atualiza os dados no localStorage
  localStorage.setItem('entradas', JSON.stringify(entradas));
  localStorage.setItem('saidas', JSON.stringify(saidas));

  // Atualiza a interface e os totais
  atualizarResumo();
  renderizarTransacoes();
}

function limparCampos() {
  document.getElementById('descricao').value = '';
  document.getElementById('valor').value = '';
  document.getElementById('data-vencimento').value = '';
  document.getElementById('fixo').value = 'nao-fixo';
  document.getElementById('parcelas').value = '';
  document.getElementById('tipo').value = 'entrada';
}

// Inicializa a página com os dados salvos
document.addEventListener('DOMContentLoaded', () => {
  atualizarResumo();
  renderizarTransacoes();
});
