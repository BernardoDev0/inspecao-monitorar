import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Turno } from '../types/schedule';
import { colors, spacing, borderRadius, shadows, typography } from '../constants/theme';

interface TurnoCardProps {
  turno: Turno;
}

export const TurnoCard: React.FC<TurnoCardProps> = ({ turno }) => {
  const formatarData = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const isDiurno = turno.tipo === 'Diurno';

  return (
    <View style={styles.card}>
      {/* Header do Card */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.data}>{formatarData(turno.date)}</Text>
          <View style={[styles.badge, isDiurno ? styles.badgeDiurno : styles.badgeNoturno]}>
            <Text style={styles.badgeText}>{turno.tipo}</Text>
          </View>
        </View>
        <Text style={styles.horario}>
          {turno.horarioInicio} - {turno.horarioFim}
        </Text>
      </View>

      {/* Corpo do Card */}
      <View style={styles.body}>
        <View style={styles.colaboradorRow}>
          <Text style={styles.colaboradorLabel}>👤 Colaborador:</Text>
          <Text style={styles.colaboradorNome}>{turno.colaborador}</Text>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>⏰ Checklist:</Text>
            <Text style={styles.infoValue}>{turno.checklist}</Text>
          </View>
        </View>

        {turno.entregaTelefone && (
          <View style={styles.telefoneRow}>
            <Text style={styles.telefoneLabel}>📱 Recebe telefone de:</Text>
            <Text style={styles.telefoneNome}>{turno.entregaTelefone}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgTertiary,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  data: {
    ...typography.subtitle,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  badgeDiurno: {
    backgroundColor: colors.primary,
  },
  badgeNoturno: {
    backgroundColor: colors.primaryDark,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  horario: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  body: {
    gap: spacing.sm,
  },
  colaboradorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  colaboradorLabel: {
    ...typography.label,
    fontSize: 13,
    color: colors.textMuted,
  },
  colaboradorNome: {
    ...typography.subtitle,
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  infoLabel: {
    ...typography.label,
    fontSize: 12,
    color: colors.textMuted,
  },
  infoValue: {
    ...typography.body,
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
  },
  telefoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  telefoneLabel: {
    ...typography.label,
    fontSize: 12,
    color: colors.textMuted,
  },
  telefoneNome: {
    ...typography.body,
    fontSize: 14,
    color: colors.accentGlow,
    fontWeight: '500',
  },
});

