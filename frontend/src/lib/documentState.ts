const DELETED_PREFIX = 'samjo_deleted_';

export function markDocumentDeleted(id: string): void {
  if (!id || id === 'sample') return;
  try {
    sessionStorage.setItem(`${DELETED_PREFIX}${id}`, 'true');
  } catch {
    // SessionStorage may fail in restricted/private browsing modes
  }
}

export function isDocumentDeleted(id: string): boolean {
  if (!id || id === 'sample') return false;
  try {
    return sessionStorage.getItem(`${DELETED_PREFIX}${id}`) === 'true';
  } catch {
    return false;
  }
}
