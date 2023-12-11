export function orElse<T>(optionalValue: T | null | undefined, defaultValue: T): T {
  return (optionalValue !== null && optionalValue !== undefined) ? optionalValue : defaultValue
}
