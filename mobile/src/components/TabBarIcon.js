import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

const glyphs = {
  Dashboard: '⌂',
  Produtos: '▣',
  Movimentações: '↕',
  Categorias: '◈',
};

export default function TabBarIcon({ routeName, focused }) {
  return (
    <View style={[styles.icon, focused && styles.activeIcon]}>
      <Text style={[styles.glyph, focused && styles.activeGlyph]}>{glyphs[routeName]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: { alignItems: 'center', borderRadius: 10, height: 28, justifyContent: 'center', width: 42 },
  activeIcon: { backgroundColor: colors.primarySoft },
  glyph: { color: colors.muted, fontSize: 21, fontWeight: '700', lineHeight: 23 },
  activeGlyph: { color: colors.primaryDark },
});
