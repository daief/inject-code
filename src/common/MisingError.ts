export class MissingError extends Error {
  constructor(msg?: string) {
    super(`Missing something. ${msg}\n`);
  }
}
