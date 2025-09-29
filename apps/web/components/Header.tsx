
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
                <Link to="/" className="flex items-center space-x-3">
                    {/* Brand logo: 使用你上傳的 PNG 檔 */}
                    <img
                      src="/logo.png"
                      alt="學人經 XueRenJing 品牌標誌"
                      className="h-10 w-10 md:h-12 md:w-12 object-contain"
                    />
                    <div className="flex flex-col">
                        <span className="font-bold text-lg tracking-wide">學人經 XueRenJing</span>
                        <span className="text-xs text-muted-foreground hidden sm:block">Ready Score</span>
                    </div>
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
