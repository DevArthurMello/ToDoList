import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const priorities = [{ value: 'low', label: 'Baixa' }, { value: 'medium', label: 'Média' }, { value: 'high', label: 'Alta' }];

function parseDueDate(value) {
  if (!value.trim()) return null;
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return undefined;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return undefined;
  return `${match[3]}-${match[2]}-${match[1]}`;
}

export default function TaskInput({ onAdd, colors }) {
  const [value, setValue] = useState('');
  const [dateText, setDateText] = useState('');
  const [priority, setPriority] = useState('medium');
  const [error, setError] = useState('');
  function submit() {
    const title = value.trim();
    const dueDate = parseDueDate(dateText);
    if (!title) { setError('Digite o nome da tarefa.'); return; }
    if (dueDate === undefined) { setError('Use uma data válida no formato DD/MM/AAAA.'); return; }
    onAdd({ title, dueDate, priority });
    setValue('');
    setDateText('');
    setPriority('medium');
    setError('');
  }
  return <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
    <Text style={[styles.label, { color: colors.text }]}>Nova tarefa</Text>
    <TextInput style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.input }]} placeholder="O que você precisa fazer?" placeholderTextColor={colors.muted} value={value} onChangeText={text => { setValue(text); setError(''); }} onSubmitEditing={submit} returnKeyType="done" maxLength={120} accessibilityLabel="Nome da tarefa" />
    <Text style={[styles.fieldLabel, { color: colors.muted }]}>Prazo de conclusão (opcional)</Text>
    <View style={[styles.dateRow, { borderColor: colors.border, backgroundColor: colors.input }]}><Ionicons name="calendar-outline" size={18} color={colors.muted} /><TextInput style={[styles.dateInput, { color: colors.text }]} placeholder="DD/MM/AAAA" placeholderTextColor={colors.muted} value={dateText} onChangeText={text => { setDateText(text); setError(''); }} keyboardType="number-pad" maxLength={10} accessibilityLabel="Data de conclusão" /></View>
    <Text style={[styles.fieldLabel, { color: colors.muted }]}>Prioridade</Text>
    <View style={styles.priorities}>{priorities.map(item => <Pressable key={item.value} onPress={() => setPriority(item.value)} style={[styles.chip, { backgroundColor: priority === item.value ? colors.selected : colors.input, borderColor: priority === item.value ? colors.accent : colors.border }]} accessibilityRole="radio" accessibilityState={{ selected: priority === item.value }}><View style={[styles.dot, { backgroundColor: colors.priority[item.value] }]} /><Text style={[styles.chipText, { color: priority === item.value ? colors.text : colors.muted }]}>{item.label}</Text></Pressable>)}</View>
    {!!error && <Text style={[styles.error, { color: colors.danger }]} accessibilityLiveRegion="polite">{error}</Text>}
    <Pressable style={({ pressed }) => [styles.button, { backgroundColor: colors.accent, opacity: pressed ? 0.8 : 1 }]} onPress={submit} accessibilityRole="button" accessibilityLabel="Adicionar tarefa"><Ionicons name="add" size={20} color={colors.buttonText} /><Text style={[styles.buttonText, { color: colors.buttonText }]}>Adicionar tarefa</Text></Pressable>
  </View>;
}

const styles = StyleSheet.create({ card: { borderWidth: 1, borderRadius: 14, padding: 18, marginBottom: 24 }, label: { fontSize: 16, fontWeight: '700', marginBottom: 14 }, input: { borderWidth: 1, borderRadius: 9, minHeight: 46, paddingHorizontal: 14, fontSize: 14 }, fieldLabel: { fontSize: 12, fontWeight: '600', marginTop: 16, marginBottom: 9 }, dateRow: { borderWidth: 1, borderRadius: 9, minHeight: 46, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center' }, dateInput: { flex: 1, marginLeft: 10, fontSize: 14, paddingVertical: 10 }, priorities: { flexDirection: 'row', gap: 8 }, chip: { flex: 1, borderWidth: 1, borderRadius: 9, minHeight: 38, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }, dot: { width: 7, height: 7, borderRadius: 4 }, chipText: { fontSize: 12, fontWeight: '600' }, error: { fontSize: 12, marginTop: 10 }, button: { minHeight: 46, borderRadius: 9, marginTop: 18, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 }, buttonText: { fontWeight: '700', fontSize: 14 } });
