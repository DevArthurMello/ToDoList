import { NavigationContainer, DarkTheme, TabRouter, useNavigationBuilder, createNavigatorFactory } from '@react-navigation/native';
import { Platform, View, Text, Pressable, StyleSheet, useWindowDimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import TasksScreen from '../screens/TasksScreen';
import ProfileScreen from '../screens/ProfileScreen';

const icons = { Início: 'grid-outline', Tarefas: 'checkbox-outline', Perfil: 'person-outline' };

function WorkspaceNavigator({ colors, ...options }) {
  const { state, navigation, descriptors, NavigationContent } = useNavigationBuilder(TabRouter, options);
  const { width } = useWindowDimensions();
  const web = Platform.OS === 'web';
  const compact = web && width < 760;
  return <NavigationContent><View style={[styles.shell, web && styles.webShell, { backgroundColor: colors.background }]}>
    <View style={[styles.content]}>{state.routes.map((route, index) => <View key={route.key} style={[styles.scene, index !== state.index && styles.hidden]}>{descriptors[route.key].render()}</View>)}</View>
    <View style={[styles.bar, web && styles.sidebar, compact && styles.compact, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {web && <View style={styles.brand}><Ionicons name="checkmark-done" size={28} color={colors.blue} />{!compact && <Text style={[styles.brandText, { color: colors.text }]}>TaskFlow</Text>}</View>}
      {state.routes.map((route, index) => {
        const selected = index === state.index;
        return <Pressable key={route.key} accessibilityRole="tab" accessibilityLabel={route.name} accessibilityState={{ selected }} onPress={() => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!selected && !event.defaultPrevented) navigation.navigate(route.name);
        }} style={[styles.tab, web && styles.sideTab, compact && styles.compactTab, { backgroundColor: selected ? colors.selected : 'transparent' }]}>
          <Ionicons name={icons[route.name]} size={22} color={selected ? colors.blue : colors.muted} />
          <Text style={[styles.label, web && !compact && styles.sideLabel, { color: selected ? colors.text : colors.muted }]}>{route.name}</Text>
        </Pressable>;
      })}
      {web && !compact && <Text style={[styles.footer, { color: colors.muted }]}>Seu espaço pessoal</Text>}
    </View>
  </View></NavigationContent>;
}
const Tabs = createNavigatorFactory(WorkspaceNavigator)();
export default function AppNavigator(props) {
  const theme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: props.colors.background, card: props.colors.card, primary: props.colors.accent, text: props.colors.text, border: props.colors.border } };
  return <NavigationContainer theme={theme}><Tabs.Navigator colors={props.colors} initialRouteName="Início" backBehavior="initialRoute">
    <Tabs.Screen name="Início">{screen => <HomeScreen {...props} {...screen} />}</Tabs.Screen>
    <Tabs.Screen name="Tarefas">{screen => <TasksScreen {...props} {...screen} />}</Tabs.Screen>
    <Tabs.Screen name="Perfil">{screen => <ProfileScreen {...props} {...screen} />}</Tabs.Screen>
  </Tabs.Navigator></NavigationContainer>;
}
const styles = StyleSheet.create({
  shell: { flex: 1 }, webShell: { flexDirection: 'row-reverse' }, content: { flex: 1, minWidth: 0 }, scene: { ...StyleSheet.absoluteFillObject }, hidden: { display: 'none' },
  bar: { flexDirection: 'row', borderTopWidth: 1, padding: 8, gap: 6 }, sidebar: { width: 232, flexDirection: 'column', borderTopWidth: 0, borderRightWidth: 1, padding: 16 }, compact: { width: 84, padding: 8 },
  brand: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, paddingVertical: 22, marginBottom: 24 }, brandText: { fontSize: 22, fontWeight: '800' },
  tab: { flex: 1, minHeight: 54, borderRadius: 10, alignItems: 'center', justifyContent: 'center', gap: 4 }, sideTab: { flex: 0, flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 14, marginBottom: 6, gap: 12 }, compactTab: { flexDirection: 'column', paddingHorizontal: 0, justifyContent: 'center' },
  label: { fontSize: 11, fontWeight: '600' }, sideLabel: { fontSize: 14 }, footer: { marginTop: 'auto', fontSize: 12, padding: 14 },
});

