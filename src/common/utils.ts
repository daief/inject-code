export function removeIndex<T = any>(arr: T[], index: number): T[] {
  return index < 0 ? arr : [...arr.slice(0, index), ...arr.slice(index + 1)];
}

export const NEW_THING_ID_PREFIX_MARK = 'new___';

export const NEW_THING_ID_PREFIX_MARK_REGEX = new RegExp(
  `^${NEW_THING_ID_PREFIX_MARK}`,
  'i',
);
