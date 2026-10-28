const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
test('cadastro, sessão, saída, duplicação e separação de perfis locais', async () => {
  const data = new Map();
  const adapter = { getItem: async key => data.get(key) ?? null, setItem: async (key, value) => data.set(key, value) };
  function module(file, names) {
    const source = fs.readFileSync(path.join(__dirname, '../src/storage', file), 'utf8').replace(/import AsyncStorage from .*?;/, '').replace(/export /g, '');
    return vm.runInNewContext(source + '\n({' + names + '})', { AsyncStorage: adapter });
  }
  const auth = module('authStorage.js', 'enterAccount,restoreSession,signOut');
  const tasks = module('taskStorage.js', 'loadTasks,saveTasks');
  assert.equal(await auth.restoreSession(), null);
  const first = await auth.enterAccount({ name: 'Ana', email: ' ANA@LOCAL.APP ', register: true });
  assert.equal(first.email, 'ana@local.app');
  assert.equal((await auth.restoreSession()).id, first.id);
  await assert.rejects(auth.enterAccount({ name: 'Ana', email: 'ana@local.app', register: true }));
  await tasks.saveTasks([{ id: '1', title: 'Pessoal', completed: false }], first.storageId);
  await auth.signOut();
  assert.equal(await auth.restoreSession(), null);
  const second = await auth.enterAccount({ name: 'Bia', email: 'bia@local.app', register: true });
  assert.equal((await tasks.loadTasks(second.storageId)).length, 0);
  await auth.signOut();
  const returned = await auth.enterAccount({ email: 'ana@local.app', register: false });
  assert.equal((await tasks.loadTasks(returned.storageId)).length, 1);
  await assert.rejects(auth.enterAccount({ email: 'missing@local.app', register: false }));
});
