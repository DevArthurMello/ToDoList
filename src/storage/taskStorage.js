import AsyncStorage from '@react-native-async-storage/async-storage';

const TASKS_KEY = '@taskflow/tasks';
const THEME_KEY = '@taskflow/theme';
// Uma gravação só começa quando a anterior termina.
let writeQueue = Promise.resolve();

export async function loadTasks(userId) {
  const value = await AsyncStorage.getItem(userId ? `${TASKS_KEY}/${userId}` : TASKS_KEY);
  if (value === null) return [];
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed)) throw new Error('Formato de tarefas inválido');
  const ids = new Set();
  for (const task of parsed) {
    if (!task || typeof task.id !== 'string' || !task.id || ids.has(task.id) || typeof task.title !== 'string' || !task.title.trim() || typeof task.completed !== 'boolean') {
      throw new Error('Dados de tarefas inválidos. O conteúdo original foi preservado.');
    }
    ids.add(task.id);
  }
  return parsed;
}

export function saveTasks(tasks, userId) {
  const snapshot = JSON.stringify(tasks);
  const key = userId ? `${TASKS_KEY}/${userId}` : TASKS_KEY;
  const write = writeQueue.then(() => AsyncStorage.setItem(key, snapshot));
  writeQueue = write.catch(() => {});
  return write;
}

export async function loadTheme() {
  const value = await AsyncStorage.getItem(THEME_KEY);
  return value && JSON.parse(value) === 'light' ? 'light' : 'dark';
}

export function saveTheme(theme) {
  return AsyncStorage.setItem(THEME_KEY, JSON.stringify(theme));
}
