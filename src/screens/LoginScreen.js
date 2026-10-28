import { useState } from 'react';
import { ScrollView, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { enterAccount } from '../storage/authStorage';

export default function LoginScreen({ colors, onLogin }) {
  const [register, setRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit() {
    if (busy) return;
    setBusy(true); setError('');
    try { onLogin(await enterAccount({ name, email, register })); }
    catch (err) { setError(err.message || 'Não foi possível acessar o perfil.'); }
    finally { setBusy(false); }
  }
  const inputStyle = [styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }];
  return <ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">
    <Text style={[styles.brand, { color: colors.blue }]}>TaskFlow</Text>
    <Text style={[styles.title, { color: colors.text }]}>{register ? 'Criar perfil local' : 'Entrar no seu espaço'}</Text>
    <Text style={[styles.description, { color: colors.muted }]}>Acesso local por e-mail, sem senha. Os perfis e as tarefas ficam somente neste dispositivo.</Text>
    {register && <TextInput style={inputStyle} value={name} onChangeText={setName} placeholder="Seu nome" placeholderTextColor={colors.muted} accessibilityLabel="Nome" maxLength={80} editable={!busy} />}
    <TextInput style={inputStyle} value={email} onChangeText={setEmail} placeholder="Seu e-mail" placeholderTextColor={colors.muted} accessibilityLabel="E-mail" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} maxLength={254} editable={!busy} onSubmitEditing={submit} />
    {!!error && <Text style={[styles.error, { color: colors.danger }]} accessibilityLiveRegion="polite">{error}</Text>}
    <Pressable onPress={submit} disabled={busy} accessibilityRole="button" style={[styles.button, { backgroundColor: colors.accent, opacity: busy ? 0.6 : 1 }]}><Text style={[styles.buttonText, { color: colors.buttonText }]}>{busy ? 'Aguarde…' : register ? 'Criar e entrar' : 'Entrar'}</Text></Pressable>
    <Pressable onPress={() => { setRegister(!register); setError(''); }} disabled={busy} accessibilityRole="button" style={styles.button}><Text style={{ color: colors.blue }}>{register ? 'Já tenho perfil neste dispositivo' : 'Criar um perfil local'}</Text></Pressable>
  </ScrollView>;
}
const styles = StyleSheet.create({ page: { flexGrow: 1, justifyContent: 'center', padding: 28, width: '100%', maxWidth: 480, alignSelf: 'center' }, brand: { fontSize: 22, fontWeight: '800', marginBottom: 24 }, title: { fontSize: 28, fontWeight: '800' }, description: { fontSize: 14, lineHeight: 22, marginTop: 12, marginBottom: 24 }, input: { minHeight: 50, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, marginBottom: 14, fontSize: 15 }, button: { padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 8 }, buttonText: { fontWeight: '700' }, error: { fontSize: 13, marginBottom: 8 } });
