import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import AppHeader from '../components/AppHeader';
import FilterChip from '../components/FilterChip';
import { categories, movements, products } from '../data/mockData';
import { colors, radii, shadows, spacing } from '../theme';

const typeOptions = [
  { label: 'Todas', value: '' },
  { label: 'Entrada', value: 'ENTRADA' },
  { label: 'Saída', value: 'SAIDA' },
];

export default function MovementsScreen() {
  const [selectedType, setSelectedType] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const filteredMovements = useMemo(() => movements.filter((movement) => {
    const product = products.find((entry) => entry.id === movement.productId);
    const matchesType = !selectedType || movement.type === selectedType;
    const matchesCategory = !selectedCategory || product?.categoryId === selectedCategory;
    return matchesType && matchesCategory;
  }), [selectedCategory, selectedType]);

  return (
    <Screen>
      <AppHeader eyebrow="HISTÓRICO" title="Movimentações" actionLabel="+ Registrar" onAction={() => {}} />
      <Text style={styles.filterLabel}>Tipo</Text>
      <View style={styles.chips}>
        {typeOptions.map((option) => (
          <FilterChip key={option.value} label={option.label} selected={selectedType === option.value} onPress={() => setSelectedType(option.value)} />
        ))}
      </View>
      <Text style={styles.filterLabel}>Categoria</Text>
      <View style={styles.chips}>
        <FilterChip label="Todas" selected={!selectedCategory} onPress={() => setSelectedCategory('')} />
        {categories.map((category) => (
          <FilterChip key={category.id} label={category.name} selected={selectedCategory === category.id} onPress={() => setSelectedCategory(category.id)} />
        ))}
      </View>
      <FlatList
        data={filteredMovements}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const product = products.find((entry) => entry.id === item.productId);
          const isEntry = item.type === 'ENTRADA';
          return (
            <View style={styles.item}>
              <View style={[styles.typeIcon, isEntry ? styles.entry : styles.exit]}><Text style={styles.typeIconText}>{isEntry ? '+' : '-'}</Text></View>
              <View style={styles.itemBody}><Text style={styles.itemName}>{product?.name}</Text><Text style={styles.itemDate}>{item.date}</Text></View>
              <Text style={[styles.quantity, isEntry ? styles.entryText : styles.exitText]}>{isEntry ? '+' : '-'}{item.quantity}</Text>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma movimentação encontrada.</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterLabel: { color: colors.muted, fontSize: 12, fontWeight: '800', marginBottom: 8, marginTop: 4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.small, marginBottom: 10 },
  list: { paddingTop: 6, paddingBottom: 24 },
  item: { alignItems: 'center', backgroundColor: colors.card, borderRadius: radii.card, flexDirection: 'row', marginBottom: 10, padding: 14, ...shadows.card },
  typeIcon: { alignItems: 'center', borderRadius: radii.control, height: 38, justifyContent: 'center', width: 38 },
  entry: { backgroundColor: colors.successSoft },
  exit: { backgroundColor: colors.dangerSoft },
  typeIconText: { fontSize: 20, fontWeight: '800' },
  itemBody: { flex: 1, marginLeft: 12 },
  itemName: { color: colors.text, fontSize: 14, fontWeight: '800' },
  itemDate: { color: colors.muted, fontSize: 12, marginTop: 4 },
  quantity: { fontSize: 16, fontWeight: '800' },
  entryText: { color: colors.success },
  exitText: { color: '#9B2B2B' },
  empty: { color: colors.muted, paddingTop: 30, textAlign: 'center' },
});
