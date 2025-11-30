import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows } from '../constants/theme';

const { width } = Dimensions.get('window');

interface LoadingScreenProps {
  onFinish?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish }) => {
  const progressAnim = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.8)).current;
  const iconOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    try {
      // Animação do ícone (fade in + scale)
      Animated.parallel([
        Animated.timing(iconOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(iconScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();

      // Animação da barra de progresso
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }).start(() => {
        // Quando terminar, chama o callback
        setTimeout(() => {
          try {
            onFinish?.();
          } catch (error) {
            console.error('Erro ao finalizar loading:', error);
            // Força finalizar mesmo com erro
            onFinish?.();
          }
        }, 300);
      });
    } catch (error) {
      console.error('Erro na animação de loading:', error);
      // Se der erro, finaliza imediatamente
      setTimeout(() => {
        onFinish?.();
      }, 500);
    }
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.bgPrimary, colors.bgSecondary, colors.bgPrimary]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Conteúdo sem container com fundo */}
        <View style={styles.content}>
          {/* Ícone animado */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                opacity: iconOpacity,
                transform: [{ scale: iconScale }],
              },
            ]}
          >
            <Image
              source={require('../../assets/icon.png')}
              style={styles.icon}
              resizeMode="contain"
              onError={(error) => {
                console.error('Erro ao carregar ícone:', error);
              }}
              onLoad={() => {
                console.log('Ícone carregado com sucesso');
              }}
            />
          </Animated.View>

          {/* Barra de progresso */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBackground}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    width: progressWidth,
                  },
                ]}
              >
                <LinearGradient
                  colors={[colors.primary, colors.primaryLight, colors.accent]}
                  style={styles.progressGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
              </Animated.View>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.7,
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 150,
    height: 150,
  },
  progressContainer: {
    width: '100%',
    marginTop: 20,
  },
  progressBarBackground: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.1)',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressGradient: {
    flex: 1,
    borderRadius: 3,
  },
});

export default LoadingScreen;

