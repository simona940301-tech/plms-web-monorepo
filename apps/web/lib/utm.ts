
const UTM_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
const UTM_STORAGE_KEY = 'plms_utm';

export const initializeUtm = () => {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    let hasUtm = false;

    UTM_PARAMS.forEach(param => {
        if (params.has(param)) {
            utm[param] = params.get(param)!;
            hasUtm = true;
        }
    });

    if (hasUtm) {
        localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
    }
};

export const getUtm = (): Record<string, string> | null => {
    const storedUtm = localStorage.getItem(UTM_STORAGE_KEY);
    return storedUtm ? JSON.parse(storedUtm) : null;
};
