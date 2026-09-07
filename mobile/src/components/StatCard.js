import { StyleSheet, Text, View } from 'react-native';
import { colors, radii, shadows, spacing } from '../theme';

export default function StatCard({ label, value, accent }) {
  return (
    <View style={[styles.card, { borderTopColor: accent }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 108,
    backgroundColor: colors.card,
    borderRadius: radii.card,
    borderTopWidth: 4,
    padding: spacing.card,
    ...shadows.card,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 14,
  },
  value: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
  },
});
