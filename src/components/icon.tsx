/**
 * Premium 2D icon component using expo-symbols (SF Symbols).
 * Falls back to a styled View shape if the platform doesn't support it.
 */
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { Platform } from 'react-native';

interface IconProps {
  name: SymbolViewProps['name'];
  size?: number;
  color?: string;
  style?: object;
}

export function Icon({ name, size = 24, color = '#0C5AC3', style }: IconProps) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name={name}
        style={[{ width: size, height: size }, style]}
        type="monochrome"
        tintColor={color}
      />
    );
  }

  // Android fallback: render a compact colored block resembling the icon shape
  return <AndroidIcon name={name} size={size} color={color} style={style} />;
}

// Minimal View-based icons for Android
function AndroidIcon({ name, size, color, style }: IconProps) {
  const iconSize = size ?? 24;
  const iconColor = color ?? '#0C5AC3';

  const shapes: Record<string, React.ReactNode> = {
    'house.fill': (
      <View style={[{ width: iconSize, height: iconSize }, style]}>
        {/* Roof triangle */}
        <View style={[sh.roofBase, { borderBottomColor: iconColor, borderBottomWidth: iconSize * 0.45, borderLeftWidth: iconSize * 0.5, borderRightWidth: iconSize * 0.5 }]} />
        {/* Body */}
        <View style={[sh.houseBody, { backgroundColor: iconColor, height: iconSize * 0.5, marginTop: -1 }]} />
      </View>
    ),
    'plus.circle.fill': (
      <View style={[sh.circle, { width: iconSize, height: iconSize, borderRadius: iconSize / 2, backgroundColor: iconColor }, style]}>
        <View style={[sh.plusH, { width: iconSize * 0.55, height: 2.5, backgroundColor: '#fff' }]} />
        <View style={[sh.plusV, { width: 2.5, height: iconSize * 0.55, backgroundColor: '#fff', position: 'absolute' }]} />
      </View>
    ),
    'chart.bar.fill': (
      <View style={[{ width: iconSize, height: iconSize, flexDirection: 'row', alignItems: 'flex-end', gap: 2, paddingBottom: 2 }, style]}>
        <View style={{ width: iconSize * 0.22, height: iconSize * 0.45, backgroundColor: iconColor, borderRadius: 2 }} />
        <View style={{ width: iconSize * 0.22, height: iconSize * 0.7, backgroundColor: iconColor, borderRadius: 2 }} />
        <View style={{ width: iconSize * 0.22, height: iconSize * 0.55, backgroundColor: iconColor, borderRadius: 2 }} />
        <View style={{ width: iconSize * 0.22, height: iconSize * 0.9, backgroundColor: iconColor, borderRadius: 2 }} />
      </View>
    ),
    'gearshape.fill': (
      <View style={[sh.circle, { width: iconSize, height: iconSize, borderRadius: iconSize / 2, borderWidth: 3, borderColor: iconColor }, style]}>
        <View style={[sh.circle, { width: iconSize * 0.45, height: iconSize * 0.45, borderRadius: iconSize * 0.225, backgroundColor: iconColor }]} />
      </View>
    ),
    'person.circle.fill': (
      <View style={[sh.circle, { width: iconSize, height: iconSize, borderRadius: iconSize / 2, backgroundColor: iconColor }, style]}>
        <View style={{ width: iconSize * 0.35, height: iconSize * 0.35, borderRadius: iconSize * 0.175, backgroundColor: '#fff', marginBottom: 1 }} />
        <View style={{ width: iconSize * 0.55, height: iconSize * 0.28, borderRadius: iconSize * 0.14, backgroundColor: '#fff' }} />
      </View>
    ),
    'person.fill': (
      <View style={[{ width: iconSize, height: iconSize, alignItems: 'center' }, style]}>
        <View style={{ width: iconSize * 0.45, height: iconSize * 0.45, borderRadius: iconSize * 0.225, backgroundColor: iconColor }} />
        <View style={{ width: iconSize * 0.75, height: iconSize * 0.42, borderTopLeftRadius: iconSize * 0.375, borderTopRightRadius: iconSize * 0.375, backgroundColor: iconColor, marginTop: 2 }} />
      </View>
    ),
    'bell.fill': (
      <View style={[{ width: iconSize, height: iconSize, alignItems: 'center' }, style]}>
        <View style={{ width: iconSize * 0.65, height: iconSize * 0.65, borderTopLeftRadius: iconSize * 0.325, borderTopRightRadius: iconSize * 0.325, backgroundColor: iconColor, marginTop: 3 }} />
        <View style={{ width: iconSize * 0.85, height: iconSize * 0.18, backgroundColor: iconColor, borderRadius: 2 }} />
        <View style={{ width: iconSize * 0.35, height: iconSize * 0.15, borderBottomLeftRadius: iconSize * 0.175, borderBottomRightRadius: iconSize * 0.175, backgroundColor: iconColor }} />
      </View>
    ),
    'clock.fill': (
      <View style={[sh.circle, { width: iconSize, height: iconSize, borderRadius: iconSize / 2, borderWidth: 3, borderColor: iconColor }, style]}>
        <View style={{ width: 2.5, height: iconSize * 0.3, backgroundColor: iconColor, borderRadius: 1, marginBottom: -iconSize * 0.15 }} />
        <View style={{ width: iconSize * 0.28, height: 2.5, backgroundColor: iconColor, borderRadius: 1 }} />
      </View>
    ),
    'info.circle.fill': (
      <View style={[sh.circle, { width: iconSize, height: iconSize, borderRadius: iconSize / 2, backgroundColor: iconColor }, style]}>
        <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#fff', marginBottom: 2 }} />
        <View style={{ width: 3, height: iconSize * 0.38, backgroundColor: '#fff', borderRadius: 1.5 }} />
      </View>
    ),
    'questionmark.circle.fill': (
      <View style={[sh.circle, { width: iconSize, height: iconSize, borderRadius: iconSize / 2, borderWidth: 3, borderColor: iconColor }, style]}>
        <View style={{ width: 3, height: iconSize * 0.32, backgroundColor: iconColor, borderRadius: 1.5 }} />
        <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: iconColor, marginTop: 2 }} />
      </View>
    ),
    'rectangle.portrait.and.arrow.right.fill': (
      <View style={[{ width: iconSize, height: iconSize, flexDirection: 'row', alignItems: 'center' }, style]}>
        <View style={{ width: iconSize * 0.5, height: iconSize * 0.8, borderRadius: 4, borderWidth: 2.5, borderColor: iconColor }} />
        <View style={{ marginLeft: 2 }}>
          <View style={{ width: iconSize * 0.35, height: 2.5, backgroundColor: iconColor, borderRadius: 1 }} />
          <View style={[sh.chevron, { borderTopColor: iconColor, borderLeftColor: iconColor, marginTop: -4, marginLeft: iconSize * 0.22 }]} />
        </View>
      </View>
    ),
    'arrow.right.square.fill': (
      <View style={[sh.circle, { width: iconSize, height: iconSize, borderRadius: 6, backgroundColor: iconColor, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }, style]}>
        <View style={{ width: iconSize * 0.45, height: 2.5, backgroundColor: '#fff', borderRadius: 1 }} />
        <View style={[sh.chevron, { borderTopColor: '#fff', borderLeftColor: '#fff', marginLeft: -5 }]} />
      </View>
    ),
    'chevron.right': (
      <View style={[{ width: iconSize * 0.4, height: iconSize, justifyContent: 'center' }, style]}>
        <View style={[sh.chevron, { borderTopColor: iconColor, borderLeftColor: iconColor }]} />
      </View>
    ),
    'arrow.up.right.square': (
      <View style={[{ width: iconSize, height: iconSize, borderRadius: 5, borderWidth: 2.5, borderColor: iconColor, alignItems: 'center', justifyContent: 'center' }, style]}>
        <View style={{ width: 2.5, height: iconSize * 0.3, backgroundColor: iconColor, position: 'absolute', top: 4, right: 4 }} />
        <View style={{ width: iconSize * 0.3, height: 2.5, backgroundColor: iconColor, position: 'absolute', top: 4, right: 4 }} />
      </View>
    ),
  };

  return (shapes[name as string] as React.ReactElement) ?? (
    <View style={[{ width: iconSize, height: iconSize, backgroundColor: iconColor, borderRadius: 4 }, style]} />
  );
}

const sh = StyleSheet.create({
  circle: { justifyContent: 'center', alignItems: 'center' },
  roofBase: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    alignSelf: 'center',
  },
  houseBody: { width: '70%', alignSelf: 'center', borderBottomLeftRadius: 2, borderBottomRightRadius: 2 },
  plusH: { borderRadius: 1.5 },
  plusV: { borderRadius: 1.5 },
  chevron: {
    width: 8,
    height: 8,
    borderTopWidth: 2.5,
    borderLeftWidth: 2.5,
    borderTopColor: '#000',
    borderLeftColor: '#000',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    transform: [{ rotate: '135deg' }],
  },
});
