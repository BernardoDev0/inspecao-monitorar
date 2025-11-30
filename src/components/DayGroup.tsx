import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Turno } from '../types/schedule';
import { TurnoCard } from './TurnoCard';
import { colors, spacing, typography } from '../constants/theme';

interface DayGroupProps {
  date: string;
  turnos: Turno[];
}

export const DayGroup: React.FC<DayGroupProps> = ({ date, turnos }) => {
  const formatarDataCompleta = (dateStr: string): string => {
    const dateObj = new Date(dateStr + 'T00:00:00');
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataTurno = new Date(dateObj);
    dataTurno.setHours(0, 0, 0, 0);

    const isHoje = dataTurno.getTime() === hoje.getTime();
    const isAmanha = dataTurno.getTime() === hoje.getTime() + 86400000;

    if (isHoje) {
      return 'Hoje';
    } else if (isAmanha) {
      return 'Amanhã';
    }

    return dateObj.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{formatarDataCompleta(date)}</Text>
        <Text style={styles.subtitle}>{turnos.length} turno{turnos.length !== 1 ? 's' : ''}</Text>
      </View>
      <View style={styles.turnosContainer}>
        {turnos.map((turno) => (
          <TurnoCard key={turno.id} turno={turno} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  title: {
    ...typography.subtitle,
    fontSize: 18,
    color: colors.textPrimary,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  subtitle: {
    ...typography.label,
    fontSize: 12,
    color: colors.textMuted,
  },
  turnosContainer: {
    gap: spacing.sm,
  },
});

