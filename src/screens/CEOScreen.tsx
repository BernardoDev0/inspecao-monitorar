import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { Button } from '../components/Button';
import { InputField } from '../components/InputField';
import { colors, spacing, typography, borderRadius } from '../constants/theme';
import { getAllInspections, clearOldInspections, deleteInspection, deleteAllInspections, updateInspection } from '../utils/storage';
import { Inspection } from '../types';
import { generateExcelFile, shareExcelFile } from '../utils/excelGenerator';

interface CEOScreenProps {
  onLogout: () => void;
}

const CEOScreen: React.FC<CEOScreenProps> = ({ onLogout }) => {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingExcel, setGeneratingExcel] = useState(false);
  const [editingInspection, setEditingInspection] = useState<Inspection | null>(null);
  const [editMileage, setEditMileage] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editObservacoes, setEditObservacoes] = useState('');

  useEffect(() => {
    // Limpar inspeções antigas ao carregar
    clearOldInspections().catch(console.error);
    loadInspections();
  }, []);

  const loadInspections = async () => {
    try {
      setLoading(true);
      const allInspections = await getAllInspections();
      setInspections(allInspections);
    } catch (error) {
      console.error('Erro ao carregar inspeções:', error);
      Alert.alert('Erro', 'Não foi possível carregar as inspeções.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = async () => {
    if (inspections.length === 0) {
      Alert.alert('Atenção', 'Não há inspeções para exportar.');
      return;
    }

    try {
      setGeneratingExcel(true);
      const fileUri = await generateExcelFile(inspections);
      await shareExcelFile(fileUri);
      Alert.alert('Sucesso', 'Excel gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar Excel:', error);
      Alert.alert('Erro', 'Não foi possível gerar o arquivo Excel. Tente novamente.');
    } finally {
      setGeneratingExcel(false);
    }
  };

  const formatDamageInfo = (inspection: Inspection): string => {
    const damages = inspection.damages.filter((d) => d.isDamaged);
    if (damages.length === 0) {
      return 'Tudo OK';
    }
    return damages.map((d) => `${d.label} (${d.view})`).join(', ');
  };

  const handleDeleteAll = () => {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir tudo?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir Tudo',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAllInspections();
              await loadInspections();
              Alert.alert('Sucesso', 'Todas as inspeções foram excluídas.');
            } catch (error) {
              console.error('Erro ao excluir todas as inspeções:', error);
              Alert.alert('Erro', 'Não foi possível excluir todas as inspeções.');
            }
          },
        },
      ]
    );
  };

  const handleDeleteInspection = (inspectionId: string) => {
    console.log('Tentando excluir inspeção:', inspectionId);
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir esta inspeção?',
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
              console.log('Excluindo inspeção:', inspectionId);
              await deleteInspection(inspectionId);
              await loadInspections();
              Alert.alert('Sucesso', 'Inspeção excluída com sucesso.');
            } catch (error) {
              console.error('Erro ao excluir inspeção:', error);
              Alert.alert('Erro', 'Não foi possível excluir a inspeção.');
            }
          },
        },
      ]
    );
  };

  const handleEditInspection = (inspection: Inspection) => {
    setEditingInspection(inspection);
    setEditMileage(inspection.mileage.toString());
    setEditTime(inspection.time);
    setEditObservacoes(inspection.observacoes || '');
  };

  const handleSaveEdit = async () => {
    if (!editingInspection) return;

    if (!editMileage.trim() || !editTime.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha a quilometragem e a hora de retirada.');
      return;
    }

    const mileageNumber = parseFloat(editMileage.replace(/[^\d,.]/g, '').replace(',', '.'));
    if (isNaN(mileageNumber) || mileageNumber <= 0) {
      Alert.alert('Erro', 'Quilometragem inválida.');
      return;
    }

    const timeMatch = editTime.match(/^(\d{2}):(\d{2})$/);
    if (!timeMatch) {
      Alert.alert('Erro', 'Hora inválida. Use o formato HH:MM (00–23, 00–59).');
      return;
    }

    try {
      const updatedInspection: Inspection = {
        ...editingInspection,
        mileage: mileageNumber,
        time: editTime.trim(),
        employeeName: editingInspection?.employeeName || undefined,
        observacoes: editObservacoes.trim() || undefined,
        savedAt: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      };

      await updateInspection(updatedInspection);
      await loadInspections();
      setEditingInspection(null);
      Alert.alert('Sucesso', 'Inspeção atualizada com sucesso.');
    } catch (error) {
      console.error('Erro ao atualizar inspeção:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a inspeção.');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity 
            onPress={onLogout}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>Área do CEO</Text>
        <Text style={styles.headerSubtitle}>
          {inspections.length} inspeção(ões) registrada(s)
        </Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Carregando inspeções...</Text>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {inspections.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Nenhuma inspeção registrada ainda.</Text>
              </View>
            ) : (
              inspections.map((inspection) => (
                <View key={inspection.id} style={styles.inspectionCard}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardHeaderLeft}>
                      <Text style={styles.cardPlate}>{inspection.plate}</Text>
                      <Text style={styles.cardVehicle}>{inspection.vehicleName}</Text>
                    </View>
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        onPress={() => handleEditInspection(inspection)}
                        style={styles.actionButton}
                        activeOpacity={0.7}
                      >
                        <View style={styles.iconContainer}>
                          <Text style={styles.editIconText}>✎</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          console.log('Botão excluir pressionado para:', inspection.id);
                          handleDeleteInspection(inspection.id);
                        }}
                        style={styles.actionButton}
                        activeOpacity={0.7}
                      >
                        <View style={styles.iconContainer}>
                          <Text style={styles.deleteIconText}>🗑</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.cardBody}>
                    <View style={styles.cardRow}>
                      <Text style={styles.cardLabel}>Salvado em:</Text>
                      <Text style={styles.cardValue}>{inspection.savedAt}</Text>
                    </View>

                    <View style={styles.cardRow}>
                      <Text style={styles.cardLabel}>Quilometragem:</Text>
                      <Text style={styles.cardValue}>{inspection.mileage.toLocaleString('pt-BR')} KM</Text>
                    </View>

                    <View style={styles.cardRow}>
                      <Text style={styles.cardLabel}>Horário de Retirada:</Text>
                      <Text style={styles.cardValue}>{inspection.time}</Text>
                    </View>

                    {inspection.employeeName && (
                      <View style={styles.cardRow}>
                        <Text style={styles.cardLabel}>Nome do Funcionário:</Text>
                        <Text style={styles.cardValue}>{inspection.employeeName}</Text>
                      </View>
                    )}


                    <View style={styles.cardRow}>
                      <Text style={styles.cardLabel}>Status:</Text>
                      <Text style={[styles.cardValue, styles.statusText]}>
                        {formatDamageInfo(inspection)}
                      </Text>
                    </View>

                    {inspection.observacoes && inspection.observacoes.trim() !== '' && (
                      <View style={styles.cardRow}>
                        <Text style={styles.cardLabel}>Observações:</Text>
                        <Text style={styles.cardValue}>{inspection.observacoes}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* Botão de Download */}
          <View style={styles.footer}>
            <Button
              title={generatingExcel ? 'Gerando Excel...' : 'Baixar Excel'}
              onPress={handleDownloadExcel}
              variant="primary"
              style={styles.downloadButton}
              loading={generatingExcel}
              disabled={generatingExcel || inspections.length === 0}
            />
            <TouchableOpacity
              onPress={handleDeleteAll}
              style={[
                styles.deleteAllButton,
                inspections.length === 0 && styles.deleteAllButtonDisabled
              ]}
              disabled={inspections.length === 0}
              activeOpacity={0.8}
            >
              <Text style={styles.deleteAllButtonText}>Excluir Tudo</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Modal de Edição */}
      <Modal
        visible={editingInspection !== null}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setEditingInspection(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Inspeção</Text>
            
            {editingInspection && (
              <>
                <View style={styles.modalInfo}>
                  <Text style={styles.modalInfoText}>
                    {editingInspection.vehicleName} {editingInspection.plate}
                  </Text>
                </View>

                <InputField
                  label="QUILOMETRAGEM (KM)"
                  value={editMileage}
                  onChangeText={setEditMileage}
                  placeholder="120,500"
                  keyboardType="numeric"
                />

                <InputField
                  label="NOME DO FUNCIONÁRIO"
                  value={editingInspection?.employeeName || ''}
                  onChangeText={(text) => {
                    if (editingInspection) {
                      setEditingInspection({
                        ...editingInspection,
                        employeeName: text
                      });
                    }
                  }}
                  placeholder="Digite o nome do funcionário"
                />

                <InputField
                  label="HORA DE RETIRADA"
                  value={editTime}
                  onChangeText={(t) => {
                    const digits = t.replace(/\D/g, '').slice(0, 4);
                    if (digits.length <= 2) {
                      setEditTime(digits);
                    } else {
                      setEditTime(`${digits.slice(0, 2)}:${digits.slice(2)}`);
                    }
                  }}
                  placeholder="14:30"
                  keyboardType="numeric"
                  maxLength={5}
                />

                <InputField
                  label="OBSERVAÇÕES (OPCIONAL)"
                  value={editObservacoes}
                  onChangeText={setEditObservacoes}
                  placeholder="Digite observações sobre a inspeção..."
                  multiline
                  numberOfLines={4}
                  style={styles.observacoesInput}
                />

                <View style={styles.modalButtons}>
                  <Button
                    title="Cancelar"
                    onPress={() => setEditingInspection(null)}
                    variant="secondary"
                    style={styles.modalButton}
                  />
                  <Button
                    title="Salvar"
                    onPress={handleSaveEdit}
                    variant="primary"
                    style={styles.modalButton}
                  />
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.bgPrimary,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  backButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: 8,
  },
  backButtonText: {
    ...typography.body,
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
  },
  headerTitle: {
    ...typography.title,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    ...typography.body,
    fontSize: 14,
    color: colors.textMuted,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.body,
    marginTop: spacing.md,
    color: colors.textMuted,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  inspectionCard: {
    backgroundColor: colors.bgTertiary,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardHeaderLeft: {
    flex: 1,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    padding: spacing.xs,
    zIndex: 10,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(30, 39, 73, 0.6)',
    borderWidth: 1.5,
    borderColor: 'rgba(96, 165, 250, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(96, 165, 250, 0.5)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  editIconText: {
    fontSize: 18,
    color: colors.accent,
    fontWeight: 'bold',
    textShadowColor: colors.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  deleteIconText: {
    fontSize: 18,
    color: colors.danger,
    fontWeight: 'bold',
    textShadowColor: colors.danger,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  cardPlate: {
    ...typography.subtitle,
    fontSize: 20,
    color: colors.accent,
  },
  cardVehicle: {
    ...typography.body,
    fontSize: 16,
    color: colors.textSecondary,
  },
  cardBody: {
    gap: spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardLabel: {
    ...typography.label,
    fontSize: 12,
    color: colors.textMuted,
    flex: 1,
  },
  cardValue: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    flex: 2,
    textAlign: 'right',
  },
  statusText: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  footer: {
    padding: spacing.lg,
    backgroundColor: colors.bgPrimary,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  downloadButton: {
    marginBottom: spacing.md,
  },
  deleteAllButton: {
    marginTop: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    minHeight: 52,
    backgroundColor: 'rgba(239, 68, 68, 0.15)', // danger com transparência
    borderWidth: 2,
    borderColor: 'rgba(239, 68, 68, 0.5)', // danger com transparência
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'rgba(239, 68, 68, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  deleteAllButtonDisabled: {
    opacity: 0.4,
  },
  deleteAllButtonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: colors.danger,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 16,
    padding: spacing.lg,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    ...typography.title,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  modalInfo: {
    marginBottom: spacing.lg,
    padding: spacing.md,
    backgroundColor: colors.bgTertiary,
    borderRadius: 8,
  },
  modalInfoText: {
    ...typography.body,
    fontSize: 16,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  modalButton: {
    flex: 1,
  },
  observacoesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
});

export default CEOScreen;

