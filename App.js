import { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import { restoreSession, signOut } from './src/storage/authStorage';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/styles/theme';
import { loadTasks, saveTasks } from './src/storage/taskStorage';

function Workspace({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [loadAttempt, setLoadAttempt] = useState(0);
  const [saveAttempt, setSaveAttempt] = useState(0);
  const [saveStatus, setSaveStatus] = useState('saved');
  const [feedback, setFeedback] = useState('');
  const palette = colors.dark;

  useEffect(() => {
    let active = true;
    setLoadError(false);
    loadTasks(user.storageId).then(saved => {
      if (active) { setTasks(saved); setReady(true); }
    }).catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, [loadAttempt, user.storageId]);

  useEffect(() => {
    if (!ready) return;
    let active = true;
    setSaveStatus('saving');
    saveTasks(tasks, user.storageId).then(() => {
      if (active) setSaveStatus('saved');
    }).catch(() => { if (active) setSaveStatus('error'); });
    return () => { active = false; };
  }, [tasks, ready, saveAttempt, user.storageId]);

  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => setFeedback(''), 2200);
    return () => clearTimeout(timer);
  }, [feedback]);

  function addTask({ title, dueDate, priority }) {
    setTasks(current => [{ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, title, dueDate, priority, completed: false, createdAt: new Date().toISOString() }, ...current]);
    setFeedback('Tarefa adicionada!');
  }
  function toggleTask(id) {
    setTasks(current => current.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    setFeedback('Tarefa atualizada!');
  }
  function deleteTask(id) {
    setTasks(current => current.filter(task => task.id !== id));
    setFeedback('Tarefa excluída!');
  }

  return <SafeAreaProvider><SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}>
    <StatusBar style="light" />
    {!ready ? <View style={styles.loading}>
      {!loadError && <ActivityIndicator color={palette.blue} size="large" />}
      <Text style={[styles.message, { color: palette.text }]}>{loadError ? 'Não foi possível abrir suas tarefas. Os dados salvos foram preservados.' : 'Carregando suas tarefas…'}</Text>
      {loadError && <Pressable style={[styles.retry, { backgroundColor: palette.accent }]} onPress={() => setLoadAttempt(value => value + 1)} accessibilityRole="button"><Text style={{ color: palette.buttonText }}>Tentar novamente</Text></Pressable>}
    </View> : <>
      <View style={[styles.storageStatus, { borderColor: palette.border }]}>
        <Text style={[styles.statusText, { color: saveStatus === 'error' ? palette.danger : palette.muted }]} accessibilityLiveRegion="polite">{saveStatus === 'error' ? 'Não foi possível salvar as alterações.' : saveStatus === 'saving' ? 'Salvando no dispositivo…' : 'Tarefas salvas neste dispositivo'}</Text>
        {saveStatus === 'error' && <Pressable onPress={() => setSaveAttempt(value => value + 1)} accessibilityRole="button" style={styles.retryLink}><Text style={{ color: palette.blue }}>Tentar novamente</Text></Pressable>}
      </View>
      <AppNavigator user={user} onLogout={async () => { await saveTasks(tasks, user.storageId); await onLogout(); }} tasks={tasks} theme="dark" colors={palette} feedback={feedback} onAdd={addTask} onToggle={toggleTask} onDelete={deleteTask} />
    </>}
  </SafeAreaView></SafeAreaProvider>;
}
const styles = StyleSheet.create({ container: { flex: 1 }, loading: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }, message: { textAlign: 'center', lineHeight: 22, marginVertical: 18 }, retry: { padding: 14, borderRadius: 10 }, storageStatus: { paddingHorizontal: 18, paddingVertical: 8, borderBottomWidth: 1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }, statusText: { fontSize: 12 }, retryLink: { paddingVertical: 8 } });

export default function App() {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setError(false);
    restoreSession().then(saved => { if (active) { setUser(saved); setLoaded(true); } }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [attempt]);
  async function logout() { await signOut(); setUser(null); }
  if (loaded && user) return <Workspace key={user.id} user={user} onLogout={logout} />;
  const palette = colors.dark;
  return <SafeAreaProvider><SafeAreaView style={[styles.container, { backgroundColor: palette.background }]}><StatusBar style="light" />
    {loaded ? <LoginScreen colors={palette} onLogin={setUser} /> : <View style={styles.loading}>
      <Text style={[styles.message, { color: palette.text }]}>{error ? 'Não foi possível recuperar a sessão local.' : 'Abrindo TaskFlow…'}</Text>
      {error && <Pressable onPress={() => setAttempt(value => value + 1)} style={[styles.retry, { backgroundColor: palette.accent }]} accessibilityRole="button"><Text style={{ color: palette.buttonText }}>Tentar novamente</Text></Pressable>}
    </View>}
  </SafeAreaView></SafeAreaProvider>;
}
