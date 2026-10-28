import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { shadow } from '../styles/theme';

export default function TaskCard({ task, colors, onToggle, onDelete }) {
  const priority = { low: 'Baixa', medium: 'Média', high: 'Alta' }[task.priority] || 'Média';
  const priorityColor = colors.priority[task.priority] || colors.priority.medium;
  const dueDate = typeof task.dueDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate) ? task.dueDate.slice(8, 10) + '/' + task.dueDate.slice(5, 7) + '/' + task.dueDate.slice(0, 4) : null;
  return <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, opacity: task.completed ? 0.78 : 1 }, shadow]}>
    <Pressable onPress={() => onToggle(task.id)} style={styles.check} accessibilityRole="checkbox" accessibilityState={{ checked: task.completed }} accessibilityLabel={`Concluir ${task.title}`}><Ionicons name={task.completed ? 'checkmark-circle' : 'ellipse-outline'} size={27} color={task.completed ? colors.green : colors.muted} /></Pressable>
    <View style={styles.content}><Text style={[styles.title, { color: colors.text, textDecorationLine: task.completed ? 'line-through' : 'none' }]}>{task.title}</Text><View style={styles.meta}><View style={[styles.badge, { borderColor: priorityColor }]}><View style={[styles.dot, { backgroundColor: priorityColor }]} /><Text style={[styles.badgeText, { color: priorityColor }]}>{priority}</Text></View>{dueDate && <Text style={[styles.date, { color: colors.muted }]}>Prazo: {dueDate}</Text>}</View></View>
    <Pressable onPress={() => onDelete(task.id)} style={styles.delete} accessibilityRole="button" accessibilityLabel={`Excluir ${task.title}`}><Ionicons name="trash-outline" size={20} color={colors.muted} /></Pressable>
  </View>;
}

const styles = StyleSheet.create({ card: { flexDirection: 'row', alignItems: 'center', minHeight: 78, padding: 14, borderWidth: 1, borderRadius: 12, marginBottom: 10 }, check: { padding: 4, marginRight: 10 }, content: { flex: 1 }, title: { fontSize: 15, fontWeight: '600' }, meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginTop: 8 }, badge: { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 }, dot: { width: 6, height: 6, borderRadius: 3 }, badgeText: { fontSize: 10, fontWeight: '700' }, date: { fontSize: 11 }, delete: { padding: 9 } });
