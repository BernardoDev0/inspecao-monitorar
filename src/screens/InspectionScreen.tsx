import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, Animated, Easing, TouchableOpacity } from 'react-native';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { CarView } from '../components/CarView';
import { TabView } from '../components/TabView';
import { DamagePoint, Inspection, ClickablePoint } from '../types';
import { colors, spacing, typography, shadows } from '../constants/theme';
import { saveInspection } from '../utils/storage';

type CarViewType = 'left' | 'right' | 'front' | 'rear' | 'top';

// Pontos clicáveis de cada visão (mesmos do CarView.tsx - IDs e labels corrigidos)
const CLICKABLE_POINTS: Record<CarViewType, ClickablePoint[]> = {
  left: [
    { id: 'left-rear-door-window', x: 200, y: 90, label: 'Vidro porta tras.' },
    { id: 'left-rear-fender', x: 100, y: 130, label: 'Paralama traseiro' },
    { id: 'left-rear-wheel', x: 200, y: 90, label: 'Pneu traseiro' },
    { id: 'left-front-door', x: 200, y: 130, label: 'Porta diant.' },
    { id: 'left-front-door-window', x: 50, y: 110, label: 'Vidro porta diant.' },
    { id: 'left-front-fender', x: 250, y: 110, label: 'Paralama dianteiro' },
    { id: 'left-rear-door', x: 150, y: 160, label: 'Porta tras.' },
    { id: 'left-front-wheel', x: 60, y: 70, label: 'Pneu dianteiro' },
  ],
  right: [
    { id: 'right-front-door-window', x: 200, y: 90, label: 'Vidro porta diant.' },
    { id: 'right-front-fender', x: 200, y: 130, label: 'Paralama dianteiro' },
    { id: 'right-front-wheel', x: 100, y: 90, label: 'Pneu dianteiro' },
    { id: 'right-rear-door', x: 100, y: 130, label: 'Porta tras.' },
    { id: 'right-rear-door-window', x: 250, y: 110, label: 'Vidro porta tras.' },
    { id: 'right-rear-fender', x: 50, y: 110, label: 'Paralama traseiro' },
    { id: 'right-front-door', x: 150, y: 160, label: 'Porta diant.' },
    { id: 'right-rear-wheel', x: 240, y: 70, label: 'Pneu traseiro' },
  ],
  front: [
    { id: 'front-left-mirror', x: 120, y: 120, label: 'Retrovisor esq.' },
    { id: 'front-right-mirror', x: 180, y: 120, label: 'Retrovisor dir.' },
    { id: 'front-left-headlight', x: 150, y: 170, label: 'Farol esquerdo' },
    { id: 'front-right-headlight', x: 90, y: 210, label: 'Farol direito' },
    { id: 'front-bumper', x: 210, y: 210, label: 'Para-choque diant.' },
  ],
  rear: [
    { id: 'rear-left-light', x: 120, y: 160, label: 'Lanterna esquerda' },
    { id: 'rear-right-light', x: 180, y: 160, label: 'Lanterna direita' },
    { id: 'rear-trunk', x: 90, y: 210, label: 'Tampa traseira' },
    { id: 'rear-bumper', x: 210, y: 210, label: 'Para-choque tras.' },
  ],
  top: [
    { id: 'top-rear-window', x: 150, y: 80, label: 'Vidro traseiro' },
    { id: 'top-roof', x: 150, y: 150, label: 'Teto' },
    { id: 'top-hood', x: 150, y: 50, label: 'Capô' },
    { id: 'top-trunk', x: 150, y: 220, label: 'Tampa traseira' },
    { id: 'top-left-rear', x: 80, y: 200, label: 'Lateral esq. tras.' },
    { id: 'top-right-front', x: 220, y: 100, label: 'Lateral dir. diant.' },
    { id: 'top-right-rear', x: 220, y: 200, label: 'Lateral dir. tras.' },
    { id: 'top-windshield', x: 150, y: 110, label: 'Para-brisa' },
  ],
};

const CAR_VIEWS: CarViewType[] = ['left', 'right', 'front', 'rear', 'top'];

interface InspectionScreenProps {
  plate: string;
  vehicleName: string;
  onLogout?: () => void;
}

const InspectionScreen: React.FC<InspectionScreenProps> = ({ plate, vehicleName, onLogout }) => {
  const [employeeName, setEmployeeName] = useState(''); // Nome do funcionário
  const [mileage, setMileage] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [damages, setDamages] = useState<DamagePoint[]>([]);
  const [saving, setSaving] = useState(false);
  const successAnim = useRef(new Animated.Value(0)).current; // 0: invisível, 1: visível

  // Inicializar todos os pontos como não danificados
  useEffect(() => {
    const initialDamages: DamagePoint[] = [];
    CAR_VIEWS.forEach((viewType) => {
      CLICKABLE_POINTS[viewType].forEach((point) => {
        initialDamages.push({
          id: point.id,
          view: viewType,
          label: point.label,
          x: point.x,
          y: point.y,
          isDamaged: false,
        });
      });
    });
    setDamages(initialDamages);
  }, []);

  // Toggle do estado de um ponto (verde ↔ vermelho)
  const handlePointPress = (pointId: string) => {
    setDamages((prevDamages) =>
      prevDamages.map((damage) =>
        damage.id === pointId
          ? { ...damage, isDamaged: !damage.isDamaged }
          : damage
      )
    );
  };

  // Animação de sucesso (fade + scale)
  const runSuccessAnimation = () => {
    successAnim.setValue(0);
    Animated.sequence([
      Animated.timing(successAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.delay(900),
      Animated.timing(successAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Formatar entrada de hora enquanto digita (HH:MM) - Para a hora de retirada automática
  const formatTimeInput = (text: string): string => {
    const digits = text.replace(/\D/g, '').slice(0, 4); // somente números, até 4
    if (digits.length <= 2) return digits; // "H", "HH"
    return `${digits.slice(0, 2)}:${digits.slice(2)}`; // "HH:M" ou "HH:MM"
  };

  // Validar HH:MM (00-23 e 00-59)
  const isValidTime = (value: string): boolean => {
    const match = value.match(/^(\d{2}):(\d{2})$/);
    if (!match) return false;
    const hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
  };

  // Salvar inspeção
  const handleSave = async () => {
    if (saving) return;
    if (!mileage.trim() || !employeeName.trim()) {
      Alert.alert('Atenção', 'Por favor, preencha a quilometragem e o nome do funcionário.');
      return;
    }

    const mileageNumber = parseFloat(mileage.replace(/[^\d,.]/g, '').replace(',', '.'));
    if (isNaN(mileageNumber) || mileageNumber <= 0) {
      Alert.alert('Erro', 'Quilometragem inválida.');
      return;
    }

    try {
      setSaving(true);
      // Obter hora atual automaticamente
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const currentTime = `${hours}:${minutes}`;

      // Criar objeto de inspeção
      const inspection: Inspection = {
        id: `inspection_${Date.now()}`,
        date: getCurrentDate(),
        time: currentTime, // Hora atual automaticamente
        mileage: mileageNumber,
        damages: damages.filter(d => d.isDamaged), // Apenas os danificados
        plate: plate,
        vehicleName: vehicleName,
        savedAt: getBrasiliaTimestamp(),
        observacoes: observacoes.trim() || undefined,
        employeeName: employeeName.trim() || undefined,
      };

      // Salvar no AsyncStorage
      await saveInspection(inspection);

      // Feedback visual de sucesso
      runSuccessAnimation();

      // Limpar formulário após salvar
      setEmployeeName('');
      setMileage('');
      setObservacoes('');
      setDamages((prevDamages) =>
        prevDamages.map((damage) => ({ ...damage, isDamaged: false }))
      );
    } catch (error) {
      console.error('Erro ao salvar inspeção:', error);
      Alert.alert('Erro', 'Não foi possível salvar a inspeção. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // Obter data formatada
  const getCurrentDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Obter timestamp de Brasília formatado
  const getBrasiliaTimestamp = (): string => {
    const now = new Date();
    // Obter data/hora no fuso de Brasília
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
    
    const formatter = new Intl.DateTimeFormat('pt-BR', options);
    const parts = formatter.formatToParts(now);
    
    const day = parts.find(p => p.type === 'day')?.value || '00';
    const month = parts.find(p => p.type === 'month')?.value || '00';
    const year = parts.find(p => p.type === 'year')?.value || '0000';
    const hours = parts.find(p => p.type === 'hour')?.value || '00';
    const minutes = parts.find(p => p.type === 'minute')?.value || '00';
    const seconds = parts.find(p => p.type === 'second')?.value || '00';
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
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
        <Text style={styles.headerTitle}>Inspeção de Veículo</Text>
        <Text style={styles.headerSubtitle}>
          {vehicleName} {plate} • {getCurrentDate()}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Inputs */}
        <View style={styles.inputsContainer}>
          <InputField
            label="NOME DO FUNCIONÁRIO"
            value={employeeName}
            onChangeText={setEmployeeName}
            placeholder="Digite o nome do funcionário"
          />
          <InputField
            label="QUILOMETRAGEM (KM)"
            value={mileage}
            onChangeText={setMileage}
            placeholder="120,500"
            keyboardType="numeric"
          />
        </View>

        {/* Car Views */}
        {CAR_VIEWS.map((viewType) => (
          <CarView
            key={viewType}
            view={viewType}
            damages={damages}
            onPointPress={handlePointPress}
          />
        ))}

        {/* Observações */}
        <View style={styles.observacoesContainer}>
          <InputField
            label="OBSERVAÇÕES (OPCIONAL)"
            value={observacoes}
            onChangeText={setObservacoes}
            placeholder="Digite observações sobre a inspeção..."
            multiline
            numberOfLines={4}
            style={styles.observacoesInput}
          />
        </View>

        {/* Botão Salvar */}
        <View style={styles.buttonsContainerSingle}>
          <Button
            title={saving ? 'Salvando...' : 'Salvar'}
            onPress={handleSave}
            variant="primary"
            style={styles.buttonSingle}
            loading={saving}
            disabled={saving}
          />
        </View>
      </ScrollView>

      {/* Overlay de sucesso */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.successOverlay,
          {
            opacity: successAnim,
            transform: [
              {
                scale: successAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }),
              },
            ],
          },
        ]}
      >
        <View style={styles.successBadge}>
          <Text style={styles.successCheck}>✓</Text>
        </View>
        <Text style={styles.successText}>Inspeção salva!</Text>
      </Animated.View>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  inputsContainer: {
    marginBottom: spacing.lg,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  button: {
    flex: 1,
  },
  buttonsContainerSingle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  buttonSingle: {
    minWidth: 180,
  },
  observacoesContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  observacoesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  successOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 40,
    alignItems: 'center',
  },
  successBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
  successCheck: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 32,
  },
  successText: {
    marginTop: 8,
    color: colors.textSecondary,
    fontSize: 14,
  },
});

export default InspectionScreen;

