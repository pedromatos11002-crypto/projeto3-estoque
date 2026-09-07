import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import Screen from '../components/Screen';
import AppHeader from '../components/AppHeader';
import { categories, products } from '../data/mockData';
import { colors, radii, shadows, spacing } from '../theme';

export default function ProductsScreen() {
  const [search, setSearch] = useState('');
  const filteredProducts = useMemo(() => products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase())), [search]);

  return (
    <Screen>
      <AppHeader eyebrow="CATÁLOGO" title="Produtos" actionLabel="+ Adicionar" onAction={() => {}} />
      <View style={styles.searchWrap}>
        <Text style={styles.searchGlyph}>⌕</Text>
        <TextInput value={search} onChangeText={setSearch} placeholder="Buscar produto" placeholderTextColor={colors.muted} style={styles.search} />
      </View>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const category = categories.find((entry) => entry.id === item.categoryId);
          const isLow = item.stock < item.minimumStock;
          return (
            <View style={styles.item}>
              <View style={styles.itemIcon}><Text style={styles.itemIconText}>{item.name.charAt(0)}</Text></View>
              <View style={styles.itemBody}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemCategory}>{category?.name}</Text>
              </View>
              <View style={styles.stockBox}>
                <Text style={[styles.stock, isLow && styles.lowStock]}>{item.stock}</Text>
                <Text style={styles.stockLabel}>un.</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum produto encontrado.</Text>}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  searchWrap: { alignItems: 'center', backgroundColor: colors.card, borderColor: colors.border, borderRadius: radii.control, borderWidth: 1, flexDirection: 'row', paddingLeft: 14 },
  searchGlyph: { color: colors.primaryDark, fontSize: 25, lineHeight: 28 },
  search: { color: colors.text, flex: 1, fontSize: 15, paddingHorizontal: 10, paddingVertical: 13 },
  list: { paddingTop: 14, paddingBottom: 24 },
  item: { alignItems: 'center', backgroundColor: colors.card, borderRadius: radii.card, flexDirection: 'row', marginBottom: 10, padding: 14, ...shadows.card },
  itemIcon: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: radii.control, height: 44, justifyContent: 'center', width: 44 },
  itemIconText: { color: colors.primaryDark, fontSize: 18, fontWeight: '800' },
  itemBody: { flex: 1, marginLeft: 12 },
  itemName: { color: colors.text, fontSize: 15, fontWeight: '800' },
  itemCategory: { color: colors.muted, fontSize: 13, marginTop: 4 },
  stockBox: { alignItems: 'flex-end' },
  stock: { color: colors.primaryDark, fontSize: 18, fontWeight: '800' },
  lowStock: { color: '#9B2B2B' },
  stockLabel: { color: colors.muted, fontSize: 11, marginTop: 2 },
  empty: { color: colors.muted, paddingTop: 30, textAlign: 'center' },
});
