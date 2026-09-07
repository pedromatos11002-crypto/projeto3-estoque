import { FlatList, StyleSheet, Text, View } from 'react-native';
import Screen from '../components/Screen';
import AppHeader from '../components/AppHeader';
import { categories, products } from '../data/mockData';
import { colors, radii, shadows } from '../theme';

export default function CategoriesScreen() {
  return (
    <Screen>
      <AppHeader eyebrow="ORGANIZAÇÃO" title="Categorias" actionLabel="+ Adicionar" onAction={() => {}} />
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const productCount = products.filter((product) => product.categoryId === item.id).length;
          return (
            <View style={styles.item}>
              <View style={styles.icon}><Text style={styles.iconText}>{item.name.charAt(0)}</Text></View>
              <View style={styles.body}><Text style={styles.name}>{item.name}</Text><Text style={styles.count}>{productCount} produtos cadastrados</Text></View>
              <Text style={styles.arrow}>›</Text>
            </View>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: { paddingBottom: 24 },
  item: { alignItems: 'center', backgroundColor: colors.card, borderRadius: radii.card, flexDirection: 'row', marginBottom: 10, padding: 15, ...shadows.card },
  icon: { alignItems: 'center', backgroundColor: colors.primarySoft, borderRadius: radii.control, height: 44, justifyContent: 'center', width: 44 },
  iconText: { color: colors.primaryDark, fontSize: 18, fontWeight: '800' },
  body: { flex: 1, marginLeft: 12 },
  name: { color: colors.text, fontSize: 15, fontWeight: '800' },
  count: { color: colors.muted, fontSize: 13, marginTop: 5 },
  arrow: { color: colors.muted, fontSize: 28, fontWeight: '300' },
});
