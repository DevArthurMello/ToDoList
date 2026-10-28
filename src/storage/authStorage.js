import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@taskflow/local-accounts';
async function readAccounts() {
  const raw = await AsyncStorage.getItem(KEY);
  if (raw === null) return { users: [], session: null };
  const data = JSON.parse(raw);
  if (!Array.isArray(data.users) || data.users.some(user => !user.id || !user.name || !user.email)) throw new Error('Não foi possível ler os perfis locais.');
  return data;
}
export async function restoreSession() {
  const data = await readAccounts();
  return data.users.find(user => user.id === data.session) || null;
}
export async function enterAccount({ name, email, register }) {
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new Error('Informe um e-mail válido.');
  const data = await readAccounts();
  let user = data.users.find(item => item.email === normalized);
  if (register) {
    if (!name.trim()) throw new Error('Informe seu nome.');
    if (user) throw new Error('Este e-mail já possui um perfil neste dispositivo.');
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    // O primeiro perfil herda a lista que existia antes do acesso local.
    user = { id, name: name.trim(), email: normalized, storageId: data.users.length ? id : null };
    data.users.push(user);
  } else if (!user) throw new Error('Perfil não encontrado. Cadastre-se neste dispositivo.');
  data.session = user.id;
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
  return user;
}
export async function signOut() {
  const data = await readAccounts();
  data.session = null;
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
}
