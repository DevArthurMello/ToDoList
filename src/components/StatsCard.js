import { View, Text, StyleSheet } from 'react-native';
import { shadow } from '../styles/theme';

export default function StatsCard({ total, completed, colors }) {
  const pending = total - completed;
  const progress = total ? Math.round(completed / total * 100) : 0;
  return <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, shadow]}>
    <View style={styles.heading}><Text style={[styles.headingText, { color: colors.text }]}>Seu progresso</Text><Text style={[styles.percent, { color: colors.blue }]}>{progress}%</Text></View>
    <View style={[styles.track, { backgroundColor: colors.soft }]}><View style={[styles.fill, { width: `${progress}%`, backgroundColor: colors.accent }]} /></View>
    <View style={styles.metrics}>{[['Total', total], ['Pendentes', pending], ['Concluídas', completed]].map(([label, count]) => <View key={label} style={styles.metric}><Text style={[styles.number, { color: label === 'Concluídas' ? colors.green : colors.text }]}>{count}</Text><Text style={[styles.label, { color: colors.muted }]}>{label}</Text></View>)}</View>
  </View>;
}

const styles = StyleSheet.create({ card: { borderRadius: 14, borderWidth: 1, padding: 20, marginBottom: 22 }, heading: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, headingText: { fontSize: 16, fontWeight: '700' }, percent: { fontSize: 16, fontWeight: '800' }, track: { height: 8, borderRadius: 8, marginTop: 17, overflow: 'hidden' }, fill: { height: '100%', borderRadius: 8 }, metrics: { flexDirection: 'row', marginTop: 20 }, metric: { flex: 1, alignItems: 'center' }, number: { fontSize: 24, fontWeight: '800' }, label: { fontSize: 12, marginTop: 4 } });
