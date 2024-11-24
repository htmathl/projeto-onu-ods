import AsyncStorage from '@react-native-async-storage/async-storage';

interface Movimentacao {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'receitas' | 'despesas';
  category: 'Alimentação' | 'Educação' | 'Lazer' | 'Moradia' | 'Saúde' | 'Transporte' | 'Outros' | 'Salário' | 'Outras Receitas';
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

export const excluirMovimentacao = async (id: string) => {
  try {
    const data = await AsyncStorage.getItem('movimentacoes');
    if (data) {
      const movimentacoes = JSON.parse(data) as { receitas: Movimentacao[], despesas: Movimentacao[] };
      
      const updatedReceitas = movimentacoes.receitas.filter(item => item.id !== id);
      const updatedDespesas = movimentacoes.despesas.filter(item => item.id !== id);

      const updatedMovimentacoes = {
        receitas: updatedReceitas,
        despesas: updatedDespesas
      };

      await AsyncStorage.setItem('movimentacoes', JSON.stringify(updatedMovimentacoes));
      return true;
    } else {
      console.error('Nenhuma movimentação encontrada');
      return false;
    }
  } catch (error) {
    console.error('Erro ao excluir movimentação:', error);
    return false;
  }
};

export const filtrarMovimentacoes = async (data: string) => {
  try {
    const movimentacoes = await getMovimentacoes();
    const receitas = movimentacoes.receitas.filter((item: { date: string; }) => item.date === data);
    const despesas = movimentacoes.despesas.filter((item: { date: string; }) => item.date === data);
    return { receitas, despesas };
  } catch (error) {
    console.error('Erro ao filtrar movimentações:', error);
    return { receitas: [], despesas: [] };
  }
};


