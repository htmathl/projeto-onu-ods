import AsyncStorage from '@react-native-async-storage/async-storage';

interface Movimentacao {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'receitas' | 'despesas';
}

export let dadosIniciais = { receitas: [], despesas: [] };

export const saveMovimentacao = async (movimentacao: Movimentacao) => {
  try {
    const atual = await AsyncStorage.getItem('movimentacoes');
    const dados = atual ? JSON.parse(atual) : { receitas: [], despesas: [] };
    
    if (movimentacao.type === 'receitas') {
      dados.receitas.push(movimentacao);
    } else {
      dados.despesas.push(movimentacao);
    }
    
    await AsyncStorage.setItem('movimentacoes', JSON.stringify(dados));

    dadosIniciais = dados;
    return true;
  } catch (error) {
    console.error('Erro ao salvar:', error);
    return false;
  }
};

export const getMovimentacoes = async () => {
  try {
    const dados = await AsyncStorage.getItem('movimentacoes');
    return dados ? JSON.parse(dados) : { receitas: [], despesas: [] };
  } catch (error) {
    console.error('Erro ao recuperar:', error);
    return { receitas: [], despesas: [] };
  }
};

export const limparMovimentacoes = async () => {
  try {
    await AsyncStorage.removeItem('movimentacoes');
    return true;
  } catch (error) {
    console.error('Erro ao limpar:', error);
    return false;
  }
};