import { useState } from 'react';
import { FlatList, View, Text, Pressable, StyleSheet } from 'react-native';
import TaskInput from '../components/TaskInput';
import TaskCard from '../components/TaskCard';

export default function TasksScreen({ tasks, colors, onAdd, onToggle, onDelete, feedback }) {
  const [filter, setFilter] = useState('all');
  const visible = tasks.filter(task => filter === 'all' || (filter === 'pending' ? !task.completed : task.completed));
  return <View style={[styles.screen, { backgroundColor: colors.background }]}><FlatList data={visible} keyExtractor={task => task.id} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}
    ListHeaderComponent={<>
      <Text style={[styles.title, { color: colors.text }]}>Minhas tarefas</Text><Text style={[styles.subtitle, { color: colors.muted }]}>Organize seus prazos e prioridades.</Text>
      <TaskInput colors={colors} onAdd={onAdd} />
      <View style={styles.filters}>{[['all', 'Todas'], ['pending', 'Pendentes'], ['completed', 'Concluídas']].map(([key, label]) => <Pressable key={key} onPress={() => setFilter(key)} accessibilityRole="button" accessibilityState={{ selected: filter === key }} style={[styles.filter, { borderColor: filter === key ? colors.accent : colors.border, backgroundColor: filter === key ? colors.selected : colors.card }]}><Text style={{ color: filter === key ? colors.text : colors.muted, fontSize: 12 }}>{label}</Text></Pressable>)}</View>
      <Text style={[styles.count, { color: colors.muted }]}>{visible.length} tarefa(s)</Text>
      {!!feedback && <Text style={[styles.feedback, { color: colors.blue }]} accessibilityLiveRegion="polite">{feedback}</Text>}
    </>}
    renderItem={({ item }) => <TaskCard task={item} colors={colors} onToggle={onToggle} onDelete={onDelete} />}
    ListEmptyComponent={<View style={[styles.empty, { borderColor: colors.border }]}><Text style={[styles.emptyTitle, { color: colors.text }]}>Nenhuma tarefa por aqui</Text><Text style={[styles.emptyText, { color: colors.muted }]}>{tasks.length ? 'Selecione outro filtro para ver suas tarefas.' : 'Adicione sua primeira tarefa no formulário acima.'}</Text></View>}
  /></View>;
}
const styles = StyleSheet.create({ screen: { flex: 1 }, page: { padding: 24, paddingBottom: 40, width: '100%', maxWidth: 900, alignSelf: 'center' }, title: { fontSize: 28, fontWeight: '800' }, subtitle: { fontSize: 14, marginTop: 8, marginBottom: 24 }, filters: { flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 12 }, filter: { borderWidth: 1, borderRadius: 9, paddingHorizontal: 14, paddingVertical: 12 }, count: { fontSize: 12, marginBottom: 14 }, feedback: { fontSize: 13, marginBottom: 14 }, empty: { padding: 28, borderWidth: 1, borderRadius: 14, alignItems: 'center' }, emptyTitle: { fontSize: 16, fontWeight: '700' }, emptyText: { fontSize: 13, lineHeight: 20, textAlign: 'center', marginTop: 8 } });

