import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { colors, spacing, borderRadius, typography } from '../constants/theme';
import {
  createWorkSession,
  getWorkSessions,
  updateWorkSession,
  convertDateToISO,
  convertDateFromISO,
  validateTimeFormat,
  deleteWorkSession,
} from '../utils/workSessionApi';
import { WorkSession } from '../types/workSession';
import {
  generateWorkSessionsExcelFile,
  shareWorkSessionsExcelFile,
} from '../utils/excelGenerator';

interface PunchClockScreenProps {
  usuarioId: number;
  usuarioNome?: string;
  onBack: () => void;
}

export const PunchClockScreen: React.FC<PunchClockScreenProps> = ({
  usuarioId,
  usuarioNome,
  onBack,
}) => {
  // Estados do formulário
  const [nomeColaborador, setNomeColaborador] = useState('');
  const [data, setData] = useState('');
  const [horaEntrada, setHoraEntrada] = useState('');
  const [horaSaida, setHoraSaida] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Estados de validação
  const [erroData, setErroData] = useState('');
  const [erroHoraEntrada, setErroHoraEntrada] = useState('');
  const [erroHoraSaida, setErroHoraSaida] = useState('');

  // Estados de histórico
  const [historico, setHistorico] = useState<WorkSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistorico, setLoadingHistorico] = useState(false);

  // Estados de edição
  const [editando, setEditando] = useState<WorkSession | null>(null);
  const [modalEditando, setModalEditando] = useState(false);
  const [editHoraEntrada, setEditHoraEntrada] = useState('');
  const [editHoraSaida, setEditHoraSaida] = useState('');
  const [editObservacoes, setEditObservacoes] = useState('');
  const [editJustificativa, setEditJustificativa] = useState('');
  const [erroJustificativa, setErroJustificativa] = useState('');

  // Estados de exportação
  const [exportando, setExportando] = useState(false);

  // Inicializar data atual
  useEffect(() => {
    const hoje = new Date();
    const dia = String(hoje.getDate()).padStart(2, '0');
    const mes = String(hoje.getMonth() + 1).padStart(2, '0');
    const ano = hoje.getFullYear();
    setData(`${dia}/${mes}/${ano}`);
    carregarHistorico();
  }, []);

  // Carregar histórico
  const carregarHistorico = async () => {
    try {
      setLoadingHistorico(true);
      const hoje = new Date();
      const semanaAtras = new Date(hoje);
      semanaAtras.setDate(semanaAtras.getDate() - 7);

      const from = semanaAtras.toISOString().split('T')[0];
      const to = hoje.toISOString().split('T')[0];

      const registros = await getWorkSessions({
        usuario_id: usuarioId,
        from,
        to,
      });

      // Garantir que os registros são válidos
      if (Array.isArray(registros)) {
        setHistorico(registros);
      } else {
        console.warn('Registros não são um array:', registros);
        setHistorico([]);
      }
    } catch (error: any) {
      console.error('Erro ao carregar histórico:', error);
      
      // Verificar se é erro de rede
      if (error?.message?.includes('Network request failed') || 
          error?.message?.includes('fetch')) {
        Alert.alert(
          'Erro de Conexão',
          'Não foi possível conectar ao servidor.\n\n' +
          'Verifique:\n' +
          '• Dispositivo e máquina na mesma rede Wi-Fi\n' +
          '• Metro bundler rodando na porta 8082\n' +
          '• Firewall não bloqueando a conexão\n\n' +
          'Verifique sua conexão com internet.',
          [{ text: 'OK' }]
        );
      } else if (error?.message?.includes('Tabela work_sessions não encontrada')) {
        Alert.alert(
          'Tabela Não Encontrada',
          error.message + '\n\n' +
          'Para resolver:\n' +
          '1. Acesse o Supabase Dashboard\n' +
          '2. Vá em SQL Editor\n' +
          '3. Execute o arquivo work-sessions-setup.sql\n' +
          '4. Recarregue o app',
          [{ text: 'OK' }]
        );
      } else if (error?.message?.includes('Supabase não configurado')) {
        Alert.alert(
          'Configuração Necessária',
          error.message + '\n\n' +
          'Crie um arquivo .env na raiz do projeto com:\n' +
          'EXPO_PUBLIC_SUPABASE_URL=sua-url\n' +
          'EXPO_PUBLIC_SUPABASE_ANON_KEY=sua-chave',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Erro ao Carregar Histórico',
          error?.message || 'Não foi possível carregar o histórico de pontos.\n\n' +
          'Verifique:\n' +
          '• Conexão com Supabase\n' +
          '• Tabela work_sessions criada\n' +
          '• Políticas RLS configuradas'
        );
      }
      
      setHistorico([]);
    } finally {
      setLoadingHistorico(false);
    }
  };
  
  // Validar data (DD/MM/YYYY)
  const validarData = (dataStr: string): boolean => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dataStr)) {
      setErroData('Formato inválido. Use DD/MM/YYYY');
      return false;
    }

    const [dia, mes, ano] = dataStr.split('/').map(Number);
    const dataObj = new Date(ano, mes - 1, dia);

    if (
      dataObj.getDate() !== dia ||
      dataObj.getMonth() !== mes - 1 ||
      dataObj.getFullYear() !== ano
    ) {
      setErroData('Data inválida');
      return false;
    }

    setErroData('');
    return true;
  };

  // Validar hora
  const validarHora = (hora: string): boolean => {
    if (!hora) return true; // Hora opcional
    if (!validateTimeFormat(hora)) {
      return false;
    }
    return true;
  };

  // Máscara de data (DD/MM/YYYY)
  const aplicarMascaraData = (texto: string): string => {
    const numeros = texto.replace(/\D/g, '');
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
  };

  // Máscara de hora (HH:MM)
  const aplicarMascaraHora = (texto: string): string => {
    const numeros = texto.replace(/\D/g, '');
    if (numeros.length <= 2) return numeros;
    return `${numeros.slice(0, 2)}:${numeros.slice(2, 4)}`;
  };

  // Preencher hora atual
  const preencherHoraAtual = (tipo: 'entrada' | 'saida') => {
    const agora = new Date();
    const horas = String(agora.getHours()).padStart(2, '0');
    const minutos = String(agora.getMinutes()).padStart(2, '0');
    const horaFormatada = `${horas}:${minutos}`;

    if (tipo === 'entrada') {
      setHoraEntrada(horaFormatada);
      setErroHoraEntrada('');
    } else {
      setHoraSaida(horaFormatada);
      setErroHoraSaida('');
    }
  };

  // Salvar ponto
  const salvarPonto = async () => {
    try {
      // Limpar erros
      setErroData('');
      setErroHoraEntrada('');
      setErroHoraSaida('');

      // Validações
      if (!data) {
        setErroData('Data é obrigatória');
        return;
      }

      if (!validarData(data)) {
        return;
      }

      if (!horaEntrada && !horaSaida) {
        Alert.alert('Atenção', 'Informe pelo menos a hora de entrada ou a hora de saída.');
        return;
      }

      if (horaEntrada && !validarHora(horaEntrada)) {
        setErroHoraEntrada('Formato inválido. Use HH:MM (24h, ex: 19:00)');
        return;
      }

      if (horaSaida && !validarHora(horaSaida)) {
        setErroHoraSaida('Formato inválido. Use HH:MM (24h, ex: 07:00)');
        return;
      }

      setLoading(true);

      const dataISO = convertDateToISO(data);

      const novoRegistro = await createWorkSession({
        usuario_id: usuarioId,
        data: dataISO,
        hora_entrada: horaEntrada || null,
        hora_saida: horaSaida || null,
        observacoes: observacoes || null,
        source: 'mobile',
      });

      // Mensagem de sucesso
      const tipoRegistro = novoRegistro.hora_entrada && !novoRegistro.hora_saida
        ? 'Entrada'
        : novoRegistro.hora_saida && !novoRegistro.hora_entrada
        ? 'Saída'
        : 'Entrada e Saída';

      const horaExibida = novoRegistro.hora_entrada || novoRegistro.hora_saida || '';

      Alert.alert(
        'Sucesso',
        `Ponto registrado com sucesso: ${tipoRegistro} ${horaExibida} (${data})`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Limpar formulário
              setHoraEntrada('');
              setHoraSaida('');
              setObservacoes('');
              // Recarregar histórico
              carregarHistorico();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('Erro ao salvar ponto:', error);

      let mensagem = 'Erro ao registrar ponto. Tente novamente.';

      if (error.status === 409) {
        mensagem = error.message || 'Existe um registro de entrada sem saída. Edite esse registro ou registre a saída.';
      } else if (error.status === 429) {
        mensagem = error.message || 'Limite de registros excedido. Adicione uma observação para justificar.';
      } else if (error.message) {
        mensagem = error.message;
      }

      Alert.alert('Erro', mensagem);
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal de edição
  const abrirEdicao = (registro: WorkSession) => {
    setEditando(registro);
    setEditHoraEntrada(registro.hora_entrada || '');
    setEditHoraSaida(registro.hora_saida || '');
    setEditObservacoes(registro.observacoes || '');
    setEditJustificativa('');
    setErroJustificativa('');
    setModalEditando(true);
  };

  // Excluir ponto
  const excluirPonto = async (registro: WorkSession) => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este registro de ponto?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await deleteWorkSession(registro.id);
              Alert.alert('Sucesso', 'Registro de ponto excluído com sucesso.', [
                {
                  text: 'OK',
                  onPress: () => {
                    carregarHistorico(); // Recarregar histórico após exclusão
                  },
                },
              ]);
            } catch (error: any) {
              console.error('Erro ao excluir ponto:', error);
              Alert.alert('Erro', error.message || 'Erro ao excluir registro. Tente novamente.');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Salvar edição
  const salvarEdicao = async () => {
    try {
      if (!editando) return;

      setErroJustificativa('');

      if (!editJustificativa || editJustificativa.trim() === '') {
        setErroJustificativa('Justificativa obrigatória para editar o registro.');
        return;
      }

      if (editHoraEntrada && !validarHora(editHoraEntrada)) {
        Alert.alert('Erro', 'Formato de hora de entrada inválido. Use HH:MM (24h)');
        return;
      }

      if (editHoraSaida && !validarHora(editHoraSaida)) {
        Alert.alert('Erro', 'Formato de hora de saída inválido. Use HH:MM (24h)');
        return;
      }

      setLoading(true);

      await updateWorkSession(editando.id, {
        hora_entrada: editHoraEntrada || null,
        hora_saida: editHoraSaida || null,
        observacoes: editObservacoes || null,
        edit_reason: editJustificativa,
        edited_by: usuarioId,
      });

      Alert.alert('Sucesso', 'Registro atualizado com sucesso.', [
        {
          text: 'OK',
          onPress: () => {
            setModalEditando(false);
            setEditando(null);
            carregarHistorico();
          },
        },
      ]);
    } catch (error: any) {
      console.error('Erro ao editar ponto:', error);
      Alert.alert('Erro', error.message || 'Erro ao editar registro. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Exportar Excel
  const exportarExcel = async () => {
    try {
      setExportando(true);

      const hoje = new Date();
      const mesAtras = new Date(hoje);
      mesAtras.setMonth(mesAtras.getMonth() - 1);

      const from = mesAtras.toISOString().split('T')[0];
      const to = hoje.toISOString().split('T')[0];

      const registros = await getWorkSessions({
        usuario_id: usuarioId,
        from,
        to,
      });

      if (registros.length === 0) {
        Alert.alert('Aviso', 'Não há registros para exportar.');
        return;
      }

      const registrosComNome = registros.map((r) => ({
        ...r,
        colaborador_nome: nomeColaborador || usuarioNome || `Colaborador ${usuarioId}`,
      }));

      const fileUri = await generateWorkSessionsExcelFile(registrosComNome, {
        from,
        to,
        usuario_nome: usuarioNome,
      });

      await shareWorkSessionsExcelFile(fileUri);

      Alert.alert('Sucesso', 'Arquivo Excel gerado e compartilhado com sucesso!');
    } catch (error: any) {
      console.error('Erro ao exportar Excel:', error);
      Alert.alert('Erro', error.message || 'Erro ao exportar Excel. Tente novamente.');
    } finally {
      setExportando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={onBack} style={styles.botaoVoltarHeader}>
              <Text style={styles.botaoVoltarHeaderTexto}>← Voltar</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>Bater Ponto</Text>
        </View>

        {/* Formulário */}
        <View style={styles.form}>
          {/* Nome do Colaborador */}
          <InputField
            label="NOME DO COLABORADOR"
            value={nomeColaborador}
            onChangeText={setNomeColaborador}
            placeholder="Digite o nome do colaborador"
            autoCapitalize="words"
          />

          {/* Data */}
          <View>
            <InputField
              label="DATA"
              value={data}
              onChangeText={(text) => {
                const formatada = aplicarMascaraData(text);
                setData(formatada);
                if (formatada.length === 10) {
                  validarData(formatada);
                } else {
                  setErroData('');
                }
              }}
              placeholder="DD/MM/YYYY"
              keyboardType="numeric"
              maxLength={10}
            />
            {erroData ? <Text style={styles.erro}>{erroData}</Text> : null}
          </View>

          {/* Hora de Entrada */}
          <View>
            <View style={styles.horaContainer}>
              <View style={styles.horaInputContainer}>
                <InputField
                  label="HORA DE ENTRADA"
                  value={horaEntrada}
                  onChangeText={(text) => {
                    const formatada = aplicarMascaraHora(text);
                    setHoraEntrada(formatada);
                    if (formatada.length === 5) {
                      if (!validarHora(formatada)) {
                        setErroHoraEntrada('Formato inválido. Use HH:MM (24h)');
                      } else {
                        setErroHoraEntrada('');
                      }
                    } else {
                      setErroHoraEntrada('');
                    }
                  }}
                  placeholder="HH:MM"
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              <TouchableOpacity
                style={styles.botaoAgora}
                onPress={() => preencherHoraAtual('entrada')}
              >
                <Text style={styles.botaoAgoraTexto}>Agora</Text>
              </TouchableOpacity>
            </View>
            {erroHoraEntrada ? <Text style={styles.erro}>{erroHoraEntrada}</Text> : null}
          </View>

          {/* Hora de Saída */}
          <View>
            <View style={styles.horaContainer}>
              <View style={styles.horaInputContainer}>
                <InputField
                  label="HORA DE SAÍDA"
                  value={horaSaida}
                  onChangeText={(text) => {
                    const formatada = aplicarMascaraHora(text);
                    setHoraSaida(formatada);
                    if (formatada.length === 5) {
                      if (!validarHora(formatada)) {
                        setErroHoraSaida('Formato inválido. Use HH:MM (24h)');
                      } else {
                        setErroHoraSaida('');
                      }
                    } else {
                      setErroHoraSaida('');
                    }
                  }}
                  placeholder="HH:MM"
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>
              <TouchableOpacity
                style={styles.botaoAgora}
                onPress={() => preencherHoraAtual('saida')}
              >
                <Text style={styles.botaoAgoraTexto}>Agora</Text>
              </TouchableOpacity>
            </View>
            {erroHoraSaida ? <Text style={styles.erro}>{erroHoraSaida}</Text> : null}
          </View>

          {/* Observações */}
          <InputField
            label="OBSERVAÇÕES (OPCIONAL)"
            value={observacoes}
            onChangeText={setObservacoes}
            placeholder="Observações sobre o ponto"
            multiline
            numberOfLines={3}
            style={styles.observacoesInput}
          />

          {/* Botão Salvar */}
          <Button
            title={loading ? 'Salvando...' : 'Salvar Ponto'}
            onPress={salvarPonto}
            variant="primary"
            loading={loading}
            disabled={loading}
            style={styles.botaoSalvar}
          />
        </View>

        {/* Histórico */}
        <View style={styles.historicoContainer}>
          <View style={styles.historicoHeader}>
            <Text style={styles.historicoTitulo}>Histórico (Últimos 7 dias)</Text>
            <Button
              title="📥 Exportar Excel"
              onPress={exportarExcel}
              variant="secondary"
              loading={exportando}
              disabled={exportando}
              style={styles.botaoExportar}
            />
          </View>

          {loadingHistorico ? (
            <ActivityIndicator size="large" color={colors.accent} style={styles.loading} />
          ) : historico.length === 0 ? (
            <Text style={styles.semRegistros}>Nenhum registro encontrado</Text>
          ) : (
            <View style={styles.listaHistorico}>
              {historico.map((registro, index) => {
                // Validar registro antes de renderizar
                if (!registro || !registro.id) {
                  return null;
                }
                
                return (
                  <View key={registro.id} style={[styles.itemHistorico, index < historico.length - 1 && styles.itemHistoricoMargin]}>
                    <View style={styles.itemHeader}>
                      <Text style={styles.itemData}>
                        {registro.data ? convertDateFromISO(registro.data) : 'Data inválida'}
                      </Text>
                    {registro.overnight && (
                      <View style={styles.badgeOvernight}>
                        <Text style={styles.badgeOvernightTexto}>OVERNIGHT</Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.itemHorarios}>
                    {registro.hora_entrada && (
                      <Text style={styles.itemHora}>
                        Entrada: <Text style={styles.itemHoraValor}>{registro.hora_entrada}</Text>
                      </Text>
                    )}
                    {registro.hora_saida && (
                      <Text style={styles.itemHora}>
                        Saída: <Text style={styles.itemHoraValor}>{registro.hora_saida}</Text>
                      </Text>
                    )}
                  </View>
                  {registro.observacoes && (
                    <Text style={styles.itemObservacoes}>{registro.observacoes}</Text>
                  )}
                  {registro.edit_reason && (
                    <Text style={styles.itemEditado}>
                      ✏️ Editado: {registro.edit_reason}
                    </Text>
                  )}
                  <View style={styles.botoesAcao}>
                    <TouchableOpacity
                      style={styles.botaoEditar}
                      onPress={() => abrirEdicao(registro)}
                    >
                      <Text style={styles.botaoEditarTexto}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.botaoExcluir}
                      onPress={() => excluirPonto(registro)}
                    >
                      <Text style={styles.botaoExcluirTexto}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                );
              })}
            </View>
          )}
        </View>

      </ScrollView>

      {/* Modal de Edição */}
      <Modal
        visible={modalEditando}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalEditando(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContent}
          >
            <ScrollView>
              <Text style={styles.modalTitulo}>Editar Registro</Text>

              {editando && (
                <Text style={styles.modalData}>
                  Data: {convertDateFromISO(editando.data)}
                </Text>
              )}

              <View style={styles.horaContainer}>
                <View style={styles.horaInputContainer}>
                  <InputField
                    label="HORA DE ENTRADA"
                    value={editHoraEntrada}
                    onChangeText={(text) => {
                      const formatada = aplicarMascaraHora(text);
                      setEditHoraEntrada(formatada);
                    }}
                    placeholder="HH:MM"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                <TouchableOpacity
                  style={styles.botaoAgora}
                  onPress={() => {
                    const agora = new Date();
                    const horas = String(agora.getHours()).padStart(2, '0');
                    const minutos = String(agora.getMinutes()).padStart(2, '0');
                    setEditHoraEntrada(`${horas}:${minutos}`);
                  }}
                >
                  <Text style={styles.botaoAgoraTexto}>Agora</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.horaContainer}>
                <View style={styles.horaInputContainer}>
                  <InputField
                    label="HORA DE SAÍDA"
                    value={editHoraSaida}
                    onChangeText={(text) => {
                      const formatada = aplicarMascaraHora(text);
                      setEditHoraSaida(formatada);
                    }}
                    placeholder="HH:MM"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
                <TouchableOpacity
                  style={styles.botaoAgora}
                  onPress={() => {
                    const agora = new Date();
                    const horas = String(agora.getHours()).padStart(2, '0');
                    const minutos = String(agora.getMinutes()).padStart(2, '0');
                    setEditHoraSaida(`${horas}:${minutos}`);
                  }}
                >
                  <Text style={styles.botaoAgoraTexto}>Agora</Text>
                </TouchableOpacity>
              </View>

              <InputField
                label="OBSERVAÇÕES"
                value={editObservacoes}
                onChangeText={setEditObservacoes}
                placeholder="Observações"
                multiline
                numberOfLines={3}
                style={styles.observacoesInput}
              />

              <InputField
                label="JUSTIFICATIVA *"
                value={editJustificativa}
                onChangeText={(text) => {
                  setEditJustificativa(text);
                  setErroJustificativa('');
                }}
                placeholder="Justificativa obrigatória para edição"
                multiline
                numberOfLines={3}
                style={styles.observacoesInput}
              />
              {erroJustificativa ? (
                <Text style={styles.erro}>{erroJustificativa}</Text>
              ) : null}

              <View style={styles.modalBotoes}>
                <Button
                  title="Cancelar"
                  onPress={() => setModalEditando(false)}
                  variant="secondary"
                  style={styles.modalBotao}
                />
                <Button
                  title={loading ? 'Salvando...' : 'Salvar'}
                  onPress={salvarEdicao}
                  variant="primary"
                  loading={loading}
                  disabled={loading}
                  style={styles.modalBotao}
                />
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  headerTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: spacing.md,
  },
  botaoVoltarHeader: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  botaoVoltarHeaderTexto: {
    ...typography.body,
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
  },
  title: {
    ...typography.title,
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    fontSize: 16,
    color: colors.textMuted,
  },
  form: {
    marginBottom: spacing.xl,
  },
  horaContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  horaInputContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  botaoAgora: {
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: 24,
    justifyContent: 'center',
    minHeight: 52,
  },
  botaoAgoraTexto: {
    color: colors.bgPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  erro: {
    color: colors.danger,
    fontSize: 12,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  observacoesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  botaoSalvar: {
    marginTop: spacing.md,
  },
  historicoContainer: {
    marginTop: spacing.xl,
  },
  historicoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  historicoTitulo: {
    ...typography.subtitle,
    fontSize: 18,
  },
  botaoExportar: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 40,
  },
  loading: {
    marginVertical: spacing.xl,
  },
  semRegistros: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginVertical: spacing.xl,
  },
  listaHistorico: {
    // gap não é suportado em versões antigas do React Native
  },
  itemHistorico: {
    backgroundColor: colors.bgTertiary,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemHistoricoMargin: {
    marginBottom: spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  itemData: {
    ...typography.subtitle,
    fontSize: 16,
  },
  badgeOvernight: {
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  badgeOvernightTexto: {
    color: colors.bgPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  itemHorarios: {
    marginBottom: spacing.sm,
  },
  itemHora: {
    ...typography.body,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  itemHoraValor: {
    fontWeight: '600',
    color: colors.accent,
  },
  itemObservacoes: {
    ...typography.body,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    fontStyle: 'italic',
  },
  itemEditado: {
    ...typography.body,
    fontSize: 11,
    color: colors.warning,
    marginBottom: spacing.sm,
  },
  botaoEditar: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  botaoEditarTexto: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  botoesAcao: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  botaoExcluir: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.danger,
    borderRadius: borderRadius.sm,
  },
  botaoExcluirTexto: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.bgSecondary,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.xl,
    maxHeight: '90%',
  },
  modalTitulo: {
    ...typography.title,
    fontSize: 24,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  modalData: {
    ...typography.body,
    fontSize: 16,
    marginBottom: spacing.lg,
    textAlign: 'center',
    color: colors.textMuted,
  },
  modalBotoes: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  modalBotao: {
    flex: 1,
  },
});

