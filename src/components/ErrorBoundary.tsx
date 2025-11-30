import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors, typography } from '../constants/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erro capturado pelo ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text style={styles.title}>Ops! Algo deu errado</Text>
            <Text style={styles.message}>
              O aplicativo encontrou um erro inesperado.
            </Text>
            <Text style={styles.submessage}>
              Por favor, feche e abra o app novamente.
            </Text>
            {(typeof __DEV__ !== 'undefined' && __DEV__ && this.state.error) && (
              <ScrollView style={styles.errorContainer}>
                <Text style={styles.errorText}>
                  {this.state.error.toString()}
                </Text>
              </ScrollView>
            )}
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  title: {
    ...typography.title,
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  submessage: {
    ...typography.body,
    fontSize: 14,
    textAlign: 'center',
    color: colors.textMuted,
  },
  errorContainer: {
    marginTop: 20,
    maxHeight: 200,
    backgroundColor: colors.bgTertiary,
    padding: 12,
    borderRadius: 8,
  },
  errorText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: colors.danger,
  },
});

