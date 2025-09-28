
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export const initializeTheme = () => {
    const theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};

export const useTheme = () => {
    const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');

    useEffect(() => {
        initializeTheme();
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme) {
            setThemeState(storedTheme as Theme);
        }
    }, []);

    const setTheme = (newTheme: Theme) => {
        localStorage.setItem('theme', newTheme);
        setThemeState(newTheme);
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };
    
    return { theme, setTheme };
};
