// Storage can be blocked or contain old data.
export function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return { value: value === null ? fallback : JSON.parse(value), failed: false };
  } catch {
    return { value: fallback, failed: true };
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
