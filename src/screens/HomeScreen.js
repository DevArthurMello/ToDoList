import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import StatsCard from '../components/StatsCard';

export default function HomeScreen({ tasks, colors }) {
  const completed = tasks.filter(task => task.completed).length;
  const pending = tasks.filter(task => !task.completed);
  const date = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.page}>
    <Text style={[styles.eyebrow, { color: colors.blue }]}>TASKFLOW / VISÃO GERAL</Text>
    <Text style={[styles.title, { color: colors.text }]}>Seu progresso</Text>
    <Text style={[styles.subtitle, { color: colors.muted }]}>{date}</Text>
    <StatsCard total={tasks.length} completed={completed} colors={colors} />
    <View style={[styles.insight, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Ionicons name={tasks.length && !pending.length ? 'trophy-outline' : 'sparkles-outline'} size={30} color={colors.blue} />
      <Text style={[styles.insightTitle, { color: colors.text }]}>{!tasks.length ? 'Seu progresso começa aqui' : !pending.length ? 'Todas as tarefas concluídas!' : 'Um passo de cada vez'}</Text>
      <Text style={[styles.copy, { color: colors.muted }]}>{!tasks.length ? 'Cadastre sua primeira tarefa na aba Tarefas para acompanhar seus resultados.' : pending.length ? 'Você tem ' + pending.length + ' tarefa(s) pendente(s). Continue avançando no seu ritmo.' : 'Você finalizou tudo o que estava na sua lista. Bom trabalho!'}</Text>
    </View>
    <Text style={[styles.section, { color: colors.text }]}>Pendências por prioridade</Text>
    { [['high', 'Alta'], ['medium', 'Média'], ['low', 'Baixa']].map(([key, label]) => {
      const count = pending.filter(task => (task.priority || 'medium') === key).length;
      return <View key={key} style={[styles.row, { borderColor: colors.border, backgroundColor: colors.card }]}><View style={[styles.dot, { backgroundColor: colors.priority[key] }]} /><Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text><Text style={[styles.number, { color: colors.text }]}>{count}</Text></View>;
    })}
  </ScrollView>;
}
const styles = StyleSheet.create({ page: { padding: 24, paddingBottom: 40, width: '100%', maxWidth: 1080, alignSelf: 'center' }, eyebrow: { fontSize: 10, letterSpacing: 1.5, fontWeight: '700' }, title: { fontSize: 30, fontWeight: '800', marginTop: 12 }, subtitle: { fontSize: 13, marginTop: 8, marginBottom: 26, textTransform: 'capitalize' }, insight: { padding: 24, borderRadius: 14, borderWidth: 1, marginBottom: 28 }, insightTitle: { fontSize: 18, fontWeight: '700', marginTop: 16 }, copy: { fontSize: 14, lineHeight: 22, marginTop: 8 }, section: { fontSize: 18, fontWeight: '700', marginBottom: 14 }, row: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 18, marginBottom: 10 }, dot: { width: 8, height: 8, borderRadius: 4, marginRight: 12 }, rowLabel: { flex: 1, fontSize: 14 }, number: { fontSize: 20, fontWeight: '800' } });

