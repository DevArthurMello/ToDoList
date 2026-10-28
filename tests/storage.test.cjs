const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

// Exercita o módulo real com um adaptador em memória no lugar do dispositivo.
function storage(adapter) {
  const source = fs.readFileSync(path.join(__dirname, '../src/storage/taskStorage.js'), 'utf8')
    .replace(/import AsyncStorage from .*?;/, '')
    .replace(/export /g, '');
  return vm.runInNewContext(source + '\n({ loadTasks, saveTasks })', { AsyncStorage: adapter });
}
const task = { id: '1', title: 'Estudar', completed: false, dueDate: '2026-12-15', priority: 'high', createdAt: '2026-10-28T12:00:00Z' };

test('adiciona, reabre, conclui e exclui preservando prazo e prioridade', async () => {
  const data = new Map();
  const adapter = { getItem: async key => data.get(key) ?? null, setItem: async (key, value) => data.set(key, value) };
  let store = storage(adapter);
  assert.equal((await store.loadTasks()).length, 0);
  await store.saveTasks([task]);
  store = storage(adapter); // Simula uma nova instância do aplicativo.
  assert.equal(JSON.stringify(await store.loadTasks()), JSON.stringify([task]));
  await store.saveTasks([{ ...task, completed: true }]);
  assert.equal((await storage(adapter).loadTasks())[0].completed, true);
  await store.saveTasks([]);
  assert.equal((await storage(adapter).loadTasks()).length, 0);
});

test('serializa gravações e permite nova tentativa após falha', async () => {
  let simultaneous = 0;
  let max = 0;
  let calls = 0;
  let saved;
  const store = storage({ setItem: async (key, value) => {
    simultaneous++; max = Math.max(max, simultaneous);
    await new Promise(resolve => setTimeout(resolve, 5));
    simultaneous--;
    if (++calls === 1) throw new Error('Disco indisponível');
    saved = value;
  } });
  const first = store.saveTasks([task]);
  const second = store.saveTasks([{ ...task, completed: true }]);
  await assert.rejects(first);
  await second;
  assert.equal(max, 1);
  assert.equal(JSON.parse(saved)[0].completed, true);
});

test('rejeita dados corrompidos sem gravar ou descartar tarefas', async () => {
  for (const raw of ['{', '{}', JSON.stringify([task, task]), JSON.stringify([{ title: 'Sem ID' }])]) {
    let writes = 0;
    const store = storage({ getItem: async () => raw, setItem: async () => writes++ });
    await assert.rejects(store.loadTasks());
    assert.equal(writes, 0);
  }
});
