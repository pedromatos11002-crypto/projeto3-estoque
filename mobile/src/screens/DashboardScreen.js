import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import StatCard from '../components/StatCard';
import { colors, radii, shadows, spacing } from '../theme';
import { movements, products } from '../data/mockData';

export default function DashboardScreen() {
  const totalStock = products.reduce((total, product) => total + product.stock, 0);
  const entries = movements.filter((movement) => movement.type === 'ENTRADA').length;
  const exits = movements.filter((movement) => movement.type === 'SAIDA').length;

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.eyebrow}>VISÃO GERAL</Text>
        <Text style={styles.title}>Controle de Estoque</Text>
        <Text style={styles.subtitle}>Acompanhe sua operação em um só lugar.</Text>

        <View style={styles.row}>
          <StatCard label="Produtos" value={products.length} accent="#2D8A72" />
          <StatCard label="Estoque" value={totalStock} accent="#4D9BC0" />
        </View>
        <View style={styles.row}>
          <StatCard label="Entradas" value={entries} accent="#7BAA5A" />
          <StatCard label="Saídas" value={exits} accent="#D17A65" />
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Atividade recente</Text>
          <Text style={styles.panelText}>Consulte as movimentações para acompanhar as últimas alterações do estoque.</Text>
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 28, paddingBottom: 28 },
  eyebrow: { color: colors.primaryDark, fontSize: 11, fontWeight: '800', letterSpacing: 1.3 },
  title: { color: colors.text, fontSize: 30, fontWeight: '800', marginTop: 8 },
  subtitle: { color: colors.muted, fontSize: 15, marginTop: 8, marginBottom: 24 },
  row: { flexDirection: 'row', gap: spacing.medium, marginBottom: spacing.medium },
  panel: { backgroundColor: colors.primarySoft, borderRadius: radii.card, marginTop: 12, padding: spacing.card, ...shadows.card },
  panelTitle: { color: colors.text, fontSize: 17, fontWeight: '800', marginBottom: 8 },
  panelText: { color: colors.primaryInk, fontSize: 14, lineHeight: 21 },
});
