
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import useAuthStore from '../state/useAuthStore';
import { Button } from './ui/Button';
import useUiStore from '../state/useUiStore';

const Header: React.FC = () => {
    const isAuthed = useAuthStore(state => state.isAuthed);
    const openAuthModal = useUiStore(state => state.openAuthModal);

    const navLinkClasses = "text-muted-foreground hover:text-foreground transition-colors";

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center space-x-4 px-4 sm:justify-between sm:space-x-0">
                <Link to="/" className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                    <span className="font-bold">PLMS</span>
                </Link>
                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="hidden md:flex gap-6 text-sm font-medium">
                        <NavLink to="/" className={({ isActive }) => isActive ? "text-foreground" : navLinkClasses}>Home</NavLink>
                        <NavLink to="/ready-score-lite" className={({ isActive }) => isActive ? "text-foreground" : navLinkClasses}>Ready Score</NavLink>
                        <NavLink to="/parents" className={({ isActive }) => isActive ? "text-foreground" : navLinkClasses}>For Parents</NavLink>
                    </nav>
                    <div className="flex items-center space-x-2">
                        <ThemeToggle />
                        {!isAuthed && (
                            <Button onClick={openAuthModal} size="sm" variant="outline">
                                Log In
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
