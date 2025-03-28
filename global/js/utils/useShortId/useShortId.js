/**
 * Creates a 12 character unique id
 */
export function useShortId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    while (result.length < 12) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}
  
export default useShortId;