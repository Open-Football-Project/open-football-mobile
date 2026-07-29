import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { ShieldIcon } from '../../../icons/Icons';
import { colors } from '../../../theme';

interface LogoProps {
  src?: string;
  size?: number;
}

const Logo = ({ src, size = 20 }: LogoProps) => {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <View
        testID="shield-fallback"
        style={[styles.iconWrapper, { width: size, height: size }]}
      >
        <ShieldIcon
          size={size}
          color={colors.text.secondary}
          testID="shield-icon"
        />
      </View>
    );
  }

  return (
    <Image
      testID="team-logo"
      source={{ uri: src }}
      style={[styles.image, { width: size, height: size }]}
      onError={() => setError(true)}
    />
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    width: 20,
    height: 20,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
    backgroundColor: 'transparent',
  },
});

export default Logo;
