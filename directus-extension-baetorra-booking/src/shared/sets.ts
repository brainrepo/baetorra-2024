export function areSetsEqual<K>(a: Set<K>, b: Set<K>) {
  return a.size === b.size && [...a].every((value) => b.has(value));
}
