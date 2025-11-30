import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { InputField } from '../components/InputField';
import { Button } from '../components/Button';
import { colors, spacing, typography } from '../constants/theme';

interface LoginScreenProps {
  onLogin: (plate: string, vehicleName: string) => void;
  onCEOAccess: () => void;
  onScheduleAccess?: () => void;
}

// Placas válidas e seus respectivos nomes de veículos
const VALID_PLATES: Record<string, string> = {
  'RJY5I67': 'Mobi',
  'RFT9I02': 'Gol',
};

// Código de acesso do CEO
const CEO_ACCESS_CODE = 'MONI4242';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onCEOAccess, onScheduleAccess }) => {
  const [plate, setPlate] = useState('');

  const handleLogin = () => {
    // Normalizar a placa (remover espaços e converter para maiúsculas)
    const normalizedPlate = plate.trim().toUpperCase().replace(/\s/g, '');

    if (!normalizedPlate) {
      Alert.alert('Atenção', 'Por favor, informe a placa do veículo.');
      return;
    }

    // Verificar se é o código do CEO
    if (normalizedPlate === CEO_ACCESS_CODE) {
      onCEOAccess();
      setPlate(''); // Limpar campo
      return;
    }

    // Verificar se a placa é válida
    const vehicleName = VALID_PLATES[normalizedPlate];
    if (!vehicleName) {
      Alert.alert('Placa Inválida', 'A placa informada não está cadastrada no sistema.');
      return;
    }

    // Limpar campo antes de navegar
    setPlate('');

    // Navegar diretamente (sem alert para não bloquear)
    onLogin(normalizedPlate, vehicleName);
  };

  // Formatar placa enquanto digita (padrão brasileiro: ABC1234 ou ABC1D23, ou código CEO: 8 caracteres)
  const formatPlate = (text: string): string => {
    // Remover caracteres não alfanuméricos e converter para maiúsculas
    const cleaned = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // Limitar a 8 caracteres (placas têm 7, código CEO tem 8)
    const limited = cleaned.slice(0, 8);
    
    return limited;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={require('../../assets/moni.png')} 
            style={styles.logo}
            resizeMode="contain"
            onError={(error) => {
              console.error('Erro ao carregar logo:', error);
            }}
            onLoad={() => {
              console.log('Logo carregado com sucesso');
            }}
          />
          <Text style={styles.title}>Inspeção de Veículos</Text>
          <Text style={styles.subtitle}>Digite a placa do veículo para continuar</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <InputField
            label="PLACA DO VEÍCULO"
            value={plate}
            onChangeText={(text) => setPlate(formatPlate(text))}
            placeholder="ABC1234"
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={8}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          <Button
            title="Entrar"
            onPress={handleLogin}
            variant="primary"
            style={styles.button}
          />

          {onScheduleAccess && (
            <Button
              title="📅 Ver Escala de Turnos"
              onPress={onScheduleAccess}
              variant="secondary"
              style={styles.button}
            />
          )}

        </View>

        {/* Info */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Placas cadastradas:{'\n'}
            Mobi RJY5I67{'\n'}
            Gol RFT9I02
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  header: {
    marginBottom: spacing.xxl,
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.title,
    fontSize: 32,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
  },
  form: {
    marginBottom: spacing.xl,
  },
  button: {
    marginTop: spacing.md,
  },
  infoContainer: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: colors.bgTertiary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoText: {
    ...typography.body,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default LoginScreen;

