export type PartialId<T extends { id: any }> = PartialKeys<T, 'id'>;

export type PartialKeys<T, K extends keyof T> = Omit<T, K> &
  { [k in K]?: T[k] };

export type AnyFunc<T = void> = (...p: any[]) => T;

export type PropType = string | number | symbol;
