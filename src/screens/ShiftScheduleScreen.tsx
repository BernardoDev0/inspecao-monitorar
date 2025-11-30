import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { DayGroup } from '../components/DayGroup';
import { generateSchedule } from '../utils/schedule';
import { Turno } from '../types/schedule';
import { colors, spacing, typography } from '../constants/theme';

interface ShiftScheduleScreenProps {
  onBack?: () => void;
}

export const ShiftScheduleScreen: React.FC<ShiftScheduleScreenProps> = ({ onBack }) => {
  // Gerar escala de turnos (30 dias)
  const turnos = useMemo(() => generateSchedule(), []);

  // Agrupar turnos por data
  const turnosPorDia = useMemo(() => {
    const grupos: Record<string, Turno[]> = {};

    turnos.forEach((turno) => {
      if (!grupos[turno.date]) {
        grupos[turno.date] = [];
      }
      grupos[turno.date].push(turno);
    });

    // Ordenar as datas
    const datasOrdenadas = Object.keys(grupos).sort((a, b) => {
      return new Date(a).getTime() - new Date(b).getTime();
    });

    return datasOrdenadas.map((date) => ({
      date,
      turnos: grupos[date],
    }));
  }, [turnos]);

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Voltar</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.title}>📅 Escala de Turnos</Text>
        <Text style={styles.subtitle}>Checklist sempre na entrada do turno</Text>
      </View>

      {/* Lista de Turnos */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {turnosPorDia.map((grupo) => (
          <DayGroup key={grupo.date} date={grupo.date} turnos={grupo.turnos} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  header: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTop: {
    marginBottom: spacing.sm,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  backButtonText: {
    ...typography.body,
    fontSize: 16,
    color: colors.accent,
    fontWeight: '500',
  },
  title: {
    ...typography.title,
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
});

