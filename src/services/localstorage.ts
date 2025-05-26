class LocalStorageService {
    getItem(key: string) {
        return JSON.parse(localStorage.getItem(key) || '{}');
    }

    setItem(key: string, value: string) {
        localStorage.setItem(key, value);
    }
}

export default new LocalStorageService();
