import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../theme';

export default function AppHeader({ eyebrow, title, actionLabel, onAction }) {
  return (
    <View style={styles.header}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
      {actionLabel && (
        <Pressable style={({ pressed }) => [styles.action, pressed && styles.actionPressed]} onPress={onAction}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.section,
    paddingTop: 24,
  },
  copy: { flex: 1, paddingRight: 12 },
  eyebrow: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.3,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '800',
    marginTop: 6,
  },
  action: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    shadowColor: colors.primaryDark,
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2,
  },
  actionPressed: { backgroundColor: colors.primaryDark },
  actionText: { color: colors.white, fontSize: 13, fontWeight: '800' },
});
