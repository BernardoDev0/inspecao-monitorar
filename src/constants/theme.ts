export const colors = {
  // Background gradients (azul escuro premium)
  bgPrimary: '#0A0E27',        // Fundo principal (azul muito escuro)
  bgSecondary: '#141B3D',      // Fundo secundário (azul escuro)
  bgTertiary: '#1E2749',       // Cards e containers
  
  // Azuis principais
  primary: '#2563EB',          // Azul elétrico (botões principais)
  primaryDark: '#1E40AF',      // Azul escuro (hover)
  primaryLight: '#3B82F6',     // Azul claro (destaques)
  
  // Acentos
  accent: '#60A5FA',           // Azul claro (bordas, ícones)
  accentGlow: '#93C5FD',       // Azul muito claro (brilho, glow)
  
  // Status
  success: '#10B981',          // Verde (ponto OK)
  danger: '#EF4444',           // Vermelho (ponto com dano)
  warning: '#F59E0B',          // Amarelo (avisos)
  
  // Textos
  textPrimary: '#F8FAFC',      // Branco suave (títulos)
  textSecondary: '#CBD5E1',    // Cinza claro (subtítulos)
  textMuted: '#64748B',        // Cinza médio (labels)
  
  // Carro
  carBody: '#1E3A8A',          // Azul médio (carroceria)
  carDark: '#1E40AF',          // Azul escuro (teto, detalhes)
  carGlass: '#DBEAFE',         // Azul clarinho (vidros)
  carWheel: '#1F2937',         // Cinza escuro (rodas)
  carChrome: '#9CA3AF',        // Cinza claro (cromados)
  
  // Bordas e sombras
  border: '#334155',           // Bordas sutis
  shadow: 'rgba(0, 0, 0, 0.5)', // Sombras profundas
  glow: 'rgba(37, 99, 235, 0.3)', // Glow azul
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: colors.textSecondary,
  },
  label: {
    fontSize: 14,
    fontWeight: '500' as const,
    color: colors.textMuted,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },
};

export const shadows = {
  card: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  button: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  glow: {
    shadowColor: colors.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
};

