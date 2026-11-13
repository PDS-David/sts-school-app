import { createSerialQueue } from './serialQueue';

export interface OutboxStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

/**
 * A per-account outbox backed by an async key/value store.
 * Keys are captured before entering the mutation queue so a logout/account
 * switch cannot redirect an already-started mutation into another account.
 * Storage and parse failures deliberately propagate: a write must never be
 * reported as queued unless it was durably persisted.
 */
export function createOutboxStore<T extends { id: string }>(
  storage: OutboxStorage,
  getNamespace: () => string,
  prefix = 'offline_outbox:',
  isValidItem?: (value: unknown) => value is T,
) {
  const serializeMutation = createSerialQueue();
  const keyForCurrentNamespace = () => `${prefix}${getNamespace()}`;

  async function read(key: string): Promise<T[]> {
    const raw = await storage.getItem(key);
    if (raw === null) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed) || (isValidItem && parsed.some((item) => !isValidItem(item)))) {
      throw new Error('Stored offline outbox contains invalid data');
    }
    return parsed as T[];
  }

  async function write(key: string, items: T[]): Promise<void> {
    await storage.setItem(key, JSON.stringify(items));
  }

  return {
    getAll(): Promise<T[]> {
      const key = keyForCurrentNamespace();
      return read(key);
    },
    enqueue(item: T): Promise<T> {
      const key = keyForCurrentNamespace();
      return serializeMutation(async () => {
        const items = await read(key);
        items.push(item);
        await write(key, items);
        return item;
      });
    },
    remove(id: string): Promise<void> {
      const key = keyForCurrentNamespace();
      return serializeMutation(async () => {
        const items = await read(key);
        await write(key, items.filter((item) => item.id !== id));
      });
    },
    async count(): Promise<number> {
      return (await read(keyForCurrentNamespace())).length;
    },
  };
}
