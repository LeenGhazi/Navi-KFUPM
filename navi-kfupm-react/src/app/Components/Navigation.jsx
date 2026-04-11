import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "../../AuthContext";
import { useTheme } from '../../ThemeContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, } from './ui/dropdown-menu';
import { Sun, Moon, LogIn, LogOut, UserCircle, Map as MapIcon, Bell, AlertCircle, Info, Menu, Bus, Settings, } from 'lucide-react';
// Navigation component that shows different links based on user role 
// and highlights active link
export function Navigation({ onLoginClick, onRegisterClick }) {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path) => location.pathname === path;
    const navLinks = [
        { path: '/', label: 'Map', icon: MapIcon },
        { path: '/bus-routes', label: 'Bus Routes', icon: Bus },
        { path: '/announcements', label: 'Announcements', icon: Bell },
        { path: '/complaints', label: 'Complaints', icon: AlertCircle },
        { path: '/about', label: 'About', icon: Info },
    ];
    // here, add Staff Dashboard to nav if user is maintenance_staff
    const staffNavLink = user?.role === 'maintenance_staff'
        ? [{ path: '/admin', label: 'Staff Dashboard', icon: Settings }]
        : [];
    // Add Admin Dashboard to nav if user is admin
    const adminNavLink = user?.role === 'admin'
        ? [{ path: '/kfupm-admin', label: 'Admin Dashboard', icon: Settings }]
        : [];
    // display the final nav links based on user role - regular users see basic links, maintenance staff see staff dashboard, admins see admin dashboard
    const allNavLinks = [...navLinks, ...staffNavLink, ...adminNavLink];
    return (<header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <MapIcon className="w-6 h-6 text-primary"/>
            <Link to="/" className="text-xl font-bold whitespace-nowrap">
              Navi-KFUPM
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 flex-1 justify-center">
            {allNavLinks.map((link) => {
            const Icon = link.icon;
            return (<Link key={link.path} to={link.path}>
                  <Button variant={isActive(link.path) ? 'default' : 'ghost'} className="gap-2">
                    <Icon className="w-4 h-4"/>
                    {link.label}
                  </Button>
                </Link>);
        })}
          </nav>

          {/* Tablet/Mobile Navigation */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {allNavLinks.map((link) => {
            const Icon = link.icon;
            return (<Link key={link.path} to={link.path}>
                      <DropdownMenuItem className="gap-2">
                        <Icon className="w-4 h-4"/>
                        {link.label}
                      </DropdownMenuItem>
                    </Link>);
        })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? (<Sun className="w-5 h-5"/>) : (<Moon className="w-5 h-5"/>)}
            </Button>

            {/* Account Button - Show when logged in */}
            {user && (<Link to="/account">
                <Button variant="ghost" size="icon" title="Account Settings">
                  <Settings className="w-5 h-5"/>
                </Button>
              </Link>)}

            {/* User Menu or Login */}
            {user ? (<DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2">
                    <UserCircle className="w-5 h-5"/>
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>{user.name}</div>
                    <div className="text-xs text-muted-foreground font-normal">
                      {user.email}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Badge variant="outline" className="capitalize">
                      {user.role.replace('_', ' ')}
                    </Badge>
                  </DropdownMenuItem>
                  {user.studentId && (<DropdownMenuItem>
                      <span className="text-xs text-muted-foreground">
                        ID: {user.studentId}
                      </span>
                    </DropdownMenuItem>)}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => {
                console.log('Navigating to account...');
                navigate('/account');
            }} className="cursor-pointer font-medium">
                    <Settings className="w-4 h-4 mr-2"/>
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600 font-medium">
                    <LogOut className="w-4 h-4 mr-2"/>
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>) : (<div className="flex items-center gap-2">
                <Button variant="ghost" onClick={onLoginClick} className="hidden sm:flex">
                  <LogIn className="w-4 h-4 mr-2"/>
                  Login
                </Button>
                <Button onClick={onRegisterClick}>Sign Up</Button>
              </div>)}
          </div>
        </div>
      </div>
    </header>);
}
