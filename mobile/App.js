import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import DashboardScreen from './src/screens/DashboardScreen';
import ProductsScreen from './src/screens/ProductsScreen';
import MovementsScreen from './src/screens/MovementsScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import TabBarIcon from './src/components/TabBarIcon';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: colors.text,
            tabBarInactiveTintColor: colors.muted,
            tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
            tabBarStyle: {
              backgroundColor: colors.card,
              borderTopColor: colors.border,
              height: 70,
              paddingBottom: 9,
              paddingTop: 7,
            },
            tabBarIcon: ({ focused }) => <TabBarIcon routeName={route.name} focused={focused} />,
          })}
        >
          <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Início' }} />
          <Tab.Screen name="Produtos" component={ProductsScreen} />
          <Tab.Screen name="Movimentações" component={MovementsScreen} options={{ tabBarLabel: 'Movimentos' }} />
          <Tab.Screen name="Categorias" component={CategoriesScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
