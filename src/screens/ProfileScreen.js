import { useState } from 'react';
import { ScrollView, View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { shadow } from '../styles/theme';

export default function ProfileScreen({ navigation, tasks, colors, user, onLogout }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function logout() {
    setBusy(true); setError('');
    try { await onLogout(); } catch { setError('Não foi possível salvar e sair. Tente novamente.'); setBusy(false); }
  }
  const completed = tasks.filter(task => task.completed).length;
  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.screen}><Text style={[styles.pageTitle, { color: colors.text }]}>Perfil do Usuário</Text>
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, shadow]}><View style={[styles.avatar, { backgroundColor: colors.soft }]}><Ionicons name="person" size={42} color={colors.blue} /></View><Text style={[styles.name, { color: colors.text }]}>{user.name}</Text><Text style={[styles.email, { color: colors.muted }]}>{user.email}</Text><Text style={[styles.note, { color: colors.muted }]}>Dados salvos neste dispositivo</Text></View>
    <View style={[styles.card, styles.stats, { backgroundColor: colors.card, borderColor: colors.border }, shadow]}><View style={styles.stat}><Text style={[styles.count, { color: colors.text }]}>{tasks.length}</Text><Text style={[styles.label, { color: colors.muted }]}>Tarefas criadas</Text></View><View style={[styles.divider, { backgroundColor: colors.border }]} /><View style={styles.stat}><Text style={[styles.count, { color: colors.green }]}>{completed}</Text><Text style={[styles.label, { color: colors.muted }]}>Concluídas</Text></View></View>
    <View style={[styles.option, { backgroundColor: colors.card, borderColor: colors.border }]}><Ionicons name="moon-outline" size={22} color={colors.blue} /><Text style={[styles.optionText, { color: colors.text }]}>Tema preto e roxo</Text><Ionicons name="checkmark-circle" size={20} color={colors.blue} /></View>
    <Pressable onPress={() => navigation.navigate('Tarefas')} style={[styles.back, { backgroundColor: colors.accent }]} accessibilityRole="button"><Ionicons name="arrow-back" size={20} color={colors.buttonText} /><Text style={[styles.backText, { color: colors.buttonText }]}>Ir para tarefas</Text></Pressable>
    {!!error && <Text style={{ color: colors.danger, marginTop: 16 }} accessibilityLiveRegion="polite">{error}</Text>}
    <Pressable onPress={logout} disabled={busy} style={[styles.back, { marginTop: 16, backgroundColor: colors.soft }]} accessibilityRole="button"><Text style={{ color: colors.text }}>{busy ? 'Saindo…' : 'Sair do perfil'}</Text></Pressable>
  </ScrollView>;
}

const styles = StyleSheet.create({ screen: { padding: 24, paddingBottom: 40, width: '100%', maxWidth: 760, alignSelf: 'center' }, pageTitle: { fontSize: 28, fontWeight: '800', marginBottom: 24 }, card: { borderRadius: 14, borderWidth: 1, padding: 24, alignItems: 'center', marginBottom: 18 }, avatar: { width: 88, height: 88, borderRadius: 44, justifyContent: 'center', alignItems: 'center' }, name: { fontSize: 22, fontWeight: '800', marginTop: 16 }, email: { fontSize: 14, marginTop: 5 }, note: { fontSize: 12, marginTop: 16 }, stats: { flexDirection: 'row' }, stat: { flex: 1, alignItems: 'center' }, count: { fontSize: 26, fontWeight: '800' }, label: { fontSize: 12, marginTop: 4 }, divider: { width: 1 }, option: { borderWidth: 1, borderRadius: 12, padding: 18, flexDirection: 'row', alignItems: 'center', marginBottom: 22 }, optionText: { flex: 1, marginLeft: 14, fontSize: 16, fontWeight: '600' }, back: { borderRadius: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 17 }, backText: { fontWeight: '700', marginLeft: 10 } });
