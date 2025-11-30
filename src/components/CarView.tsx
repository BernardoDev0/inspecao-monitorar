import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { colors, spacing, borderRadius, shadows, typography } from '../constants/theme';
import { DamagePoint, ClickablePoint } from '../types';

type CarViewType = 'left' | 'right' | 'front' | 'rear' | 'top';

interface CarViewProps {
  view: CarViewType;
  damages: DamagePoint[];
  onPointPress: (pointId: string) => void;
}

// Mapeamento das imagens do carro
const CAR_IMAGES = {
  left: require('../imagens/parte_da_esquerda.png'),
  right: require('../imagens/parte_da_direita.png'),
  front: require('../imagens/parte_da_frente.png'),
  rear: require('../imagens/parte_de_tras.png'),
  top: require('../imagens/parte_de_cima.png'),
};

// Títulos das visões
const VIEW_TITLES = {
  left: 'Vista Lateral Esquerda',
  right: 'Vista Lateral Direita',
  front: 'Vista Frontal',
  rear: 'Vista Traseira',
  top: 'Vista de Cima',
};

// Pontos clicáveis de cada visão
const CLICKABLE_POINTS: Record<CarViewType, ClickablePoint[]> = {
  left: [
    { id: 'left-rear-door-window', x: 130, y: 115, label: 'Vidro porta tras.' }, //vidro da porta de trás
    { id: 'left-rear-fender', x: 75, y: 135, label: 'Paralama traseiro' }, //paralama traseiro
    { id: 'left-rear-wheel', x: 90, y: 170, label: 'Pneu traseiro' }, //pneu parte de trás
    { id: 'left-front-door', x: 180, y: 150, label: 'Porta diant.' }, //porta da frente
    { id: 'left-front-door-window', x: 180, y: 115, label: 'Vidro porta diant.' }, // vidro da porta da frente
    { id: 'left-front-fender', x: 260, y: 130, label: 'Paralama dianteiro' }, //paralama dianteiro
    { id: 'left-rear-door', x: 130, y: 150, label: 'Porta tras.' }, // porta de trás
    { id: 'left-front-wheel', x: 253, y: 170, label: 'Pneu dianteiro' }, // pneu da frente
  ],
  right: [
    { id: 'right-front-door-window', x: 160, y: 115, label: 'Vidro porta diant.' }, // vidro da porta da frente
    { id: 'right-front-fender', x: 75, y: 130, label: 'Paralama dianteiro' }, //paralama dianteiro
    { id: 'right-front-wheel', x: 85, y: 170, label: 'Pneu dianteiro' }, //pneu parte da frente
    { id: 'right-rear-door', x: 205, y: 150, label: 'Porta tras.' },//porta de trás
    { id: 'right-rear-door-window', x: 210, y: 115, label: 'Vidro porta tras.' }, //vidro da porta de trás
    { id: 'right-rear-fender', x: 280, y: 130, label: 'Paralama traseiro' }, //paralama traseiro
    { id: 'right-front-door', x: 145, y: 150, label: 'Porta diant.' }, //porta da frente
    { id: 'right-rear-wheel', x: 260, y: 170, label: 'Pneu traseiro' }, // pneu parte de trás
  ],
  front: [
    { id: 'front-left-mirror', x: 75, y: 90, label: 'Retrovisor esq.' }, //retrovisor da esquerda
    { id: 'front-right-mirror', x: 273, y: 90, label: 'Retrovisor dir.' }, //retrovisor da direita
    { id: 'front-left-headlight', x: 100, y: 140, label: 'Farol esquerdo' }, //farol da esquerda da frente
    { id: 'front-right-headlight', x: 250, y: 140, label: 'Farol direito' }, //farol da direita da frente
    { id: 'front-bumper', x: 175, y: 190, label: 'Para-choque diant.' }, //parachoque dianteiro
  ],
  rear: [
    { id: 'rear-left-light', x: 110, y: 130, label: 'Lanterna esquerda' }, //farol da esquerda de trás
    { id: 'rear-right-light', x: 238, y: 130, label: 'Lanterna direita' }, //farol da direita de trás
    { id: 'rear-trunk', x: 175, y: 140, label: 'Tampa traseira' }, //mala
    { id: 'rear-bumper', x: 238, y: 170, label: 'Para-choque tras.' }, //parachoque traseiro
  ],
  top: [
    { id: 'top-rear-window', x: 173, y: 80, label: 'Vidro traseiro' }, // vidro de tras (atras do banco de tras do carro)
    { id: 'top-roof', x: 173, y: 120, label: 'Teto' }, // teto do carro
    { id: 'top-hood', x: 173, y: 210, label: 'Capô' }, //capô do carro
    { id: 'top-trunk', x: 173, y: 50, label: 'Tampa traseira' }, //mala do carro por cima
  ],
};

export const CarView: React.FC<CarViewProps> = ({ view, damages, onPointPress }) => {
  const points = CLICKABLE_POINTS[view];
  
  // Contar avarias nesta visão
  const damagesInView = damages.filter(d => d.view === view);
  const damageCount = damagesInView.filter(d => d.isDamaged).length;
  const totalPoints = points.length;

  // Verificar se um ponto está danificado
  const isPointDamaged = (pointId: string): boolean => {
    const damage = damagesInView.find(d => d.id === pointId);
    return damage?.isDamaged || false;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{VIEW_TITLES[view]}</Text>
        <Text style={styles.counter}>
          {totalPoints} pontos • {damageCount} avaria{damageCount !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Card com imagem do carro */}
      <View style={styles.carCard}>
        {/* Imagem de fundo */}
        <Image 
          source={CAR_IMAGES[view]} 
          style={styles.carImage}
          resizeMode="contain"
        />

        {/* Pontos clicáveis sobrepostos */}
        {points.map((point) => {
          const isDamaged = isPointDamaged(point.id);

          return (
            <TouchableOpacity
              key={point.id}
              style={[
                styles.point,
                { 
                  left: point.x - 14, 
                  top: point.y - 14,
                  backgroundColor: isDamaged ? colors.danger : colors.success,
                  borderColor: '#fff',
                }
              ]}
              onPress={() => onPointPress(point.id)}
              activeOpacity={0.7}
            >
              {/* X branco se tiver dano */}
              {isDamaged && (
                <View style={styles.xMark}>
                  <View style={styles.xLine1} />
                  <View style={styles.xLine2} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.subtitle,
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  counter: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '400',
  },
  carCard: {
    backgroundColor: colors.bgSecondary,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    position: 'relative',
    ...shadows.card,
  },
  carImage: {
    width: '100%',
    height: 250,
  },
  point: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.button,
  },
  xMark: {
    width: 16,
    height: 16,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  xLine1: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }],
  },
  xLine2: {
    position: 'absolute',
    width: 16,
    height: 2,
    backgroundColor: '#fff',
    transform: [{ rotate: '-45deg' }],
  },
});
