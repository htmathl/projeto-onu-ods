import AsyncStorage from '@react-native-async-storage/async-storage';

interface Movimentacao {
  id: string;
  description: string;
  amount: number;
  date: string;
  type: 'receitas' | 'despesas';
  category: 'Alimentação' | 'Educação' | 'Lazer' | 'Moradia' | 'Saúde' | 'Transporte' | 'Outros' | 'Salário' | 'Outras Receitas';
  recorrying: boolean;
}

export let dadosIniciais = { receitas: [], despesas: [] };

export const saveMovimentacao = async (movimentacao: Movimentacao) => {
  try {
    // Recuperar dados existentes
    const storedData = await AsyncStorage.getItem("movimentacoes");
    const currentData = storedData ? JSON.parse(storedData) : { receitas: [], despesas: [] };

    if (movimentacao.recorrying) {
      const recurringMovements = generateRecurringMovements(movimentacao);
      // Adicionar movimentações recorrentes
      currentData[movimentacao.type] = [
        ...currentData[movimentacao.type],
        ...recurringMovements,
      ];
    } else {
      // Adicionar movimentação única
      currentData[movimentacao.type].push(movimentacao);
    }

    // Salvar novamente no AsyncStorage
    await AsyncStorage.setItem("movimentacoes", JSON.stringify(currentData));
  } catch (error) {
    console.error("Erro ao salvar movimentação:", error);
    throw error;
  }
}

// Função para gerar as movimentações recorrentes
function generateRecurringMovements(movimentacao: {
  id: string;
  description: string;
  amount: number;
  type: "receitas" | "despesas";
  date: string; // ISO format
  category: string;
  recorrying: boolean;
}): Array<{
  id: string;
  description: string;
  amount: number;
  type: "receitas" | "despesas";
  date: string; // ISO format
  category: string;
  recorrying: boolean;
}> {
  const recurringMovements = [];
  const startDate = new Date(); // Começa no mês atual
  const endDate = new Date(movimentacao.date); // Data final definida pelo usuário

  while (startDate <= endDate) {
    // Gerar nova movimentação para o mês corrente
    recurringMovements.push({
      ...movimentacao,
      id: Math.random().toString(36).substr(2, 9), // Gerar novo ID único
      date: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, "0")}-${String(startDate.getDate()).padStart(2, "0")}`,
    });

    // Avançar para o próximo mês
    startDate.setMonth(startDate.getMonth() + 1);
  }

  return recurringMovements;
}

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

export const excluirTudo = async () => {
  try {
    await AsyncStorage.removeItem('movimentacoes');
    return true;
  } catch (error) {
    console.error('Erro ao excluir tudo:', error);
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
