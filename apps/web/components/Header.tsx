
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
                    {/* Brand logo: prefers PNG; falls back to SVG placeholder */}
                    <img
                      src="/logo.png"
                      alt="學人經 XueRenJing logo"
                      className="h-8 w-8 md:h-9 md:w-9 object-contain hidden sm:block"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/logo.svg'; (e.currentTarget as HTMLImageElement).style.display = 'block'; }}
                    />
                    <span className="font-bold tracking-wide">學人經 XueRenJing</span>
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
