'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ProcessType } from '@/types/database';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  ChevronRight,
  Menu,
  X,
  Home,
  Briefcase,
  Filter,
  FileText,
  HelpCircle,
  Search
} from 'lucide-react';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';
import Logo from '@/components/icons/Logo';

// Process type categories for organization
const processTypeCategories = {
  'Trabalhista': ['trabalhista'],
  'Civil': ['civil', 'jec', 'familia', 'os'],
  'Criminal': ['criminal', 'jecrim'],
  'Tributário e Fazendário': ['tributario', 'fazendario'],
  'Federal': [
    'federal_civil', 'federal_jec', 'federal_criminal', 
    'federal_jecrim', 'federal_tributario', 'federal_fazendario'
  ],
  'Administrativo': [
    'adm_inss', 'adm_municipal', 'adm_estadual', 
    'adm_federal', 'adm_cartorio', 'adm_inpi'
  ],
  'Outro': ['outro']
};

// Process type labels for better display
const processTypeLabels: Record<ProcessType, string> = {
  'trabalhista': 'Trabalhista',
  'civil': 'Civil',
  'jec': 'JEC',
  'familia': 'Família',
  'os': 'OS',
  'criminal': 'Criminal',
  'jecrim': 'JECRIM',
  'tributario': 'Tributário',
  'fazendario': 'Fazendário',
  'federal_civil': 'Federal - Civil',
  'federal_jec': 'Federal - JEC',
  'federal_criminal': 'Federal - Criminal',
  'federal_jecrim': 'Federal - JECRIM',
  'federal_tributario': 'Federal - Tributário',
  'federal_fazendario': 'Federal - Fazendário',
  'adm_inss': 'INSS',
  'adm_municipal': 'Municipal',
  'adm_estadual': 'Estadual',
  'adm_federal': 'Federal',
  'adm_cartorio': 'Cartório',
  'adm_inpi': 'INPI',
  'outro': 'Outro'
};

interface SidebarLayoutProps {
  children: React.ReactNode;
  user: any;
}

export default function SidebarLayout({ children, user }: SidebarLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  
  // Initialize expanded categories
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    Object.keys(processTypeCategories).forEach(category => {
      initialExpanded[category] = false;
    });
    setExpandedCategories(initialExpanded);
  }, []);
  
  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };
  
  // Check if a route is active
  const isActive = (path: string) => {
    return pathname === path;
  };
  
  // Check if a category has an active child
  const categoryHasActiveChild = (types: string[]) => {
    return types.some(type => pathname === `/dashboard/${type}`);
  };
  
  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Handle search submission
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/dashboard/processo?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  
  return (
    <div className="flex bg-gray-100">
      {/* Mobile sidebar toggle */}
      <button 
        className="fixed z-50 bottom-4 right-4 p-2 rounded-full bg-navy text-white shadow-lg md:hidden"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo and app name */}
        <div className="flex items-center justify-center h-16 border-b border-navy-700">
          <Link href="/" className="flex items-center">
            <div className="w-8 h-8 mr-2">
              <Logo />
            </div>
            <span className="text-xl font-bold text-white">LegalBridge</span>
          </Link>
        </div>
        
        {/* User info */}
        <div className="p-4 border-b border-navy-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-navy-700 flex items-center justify-center">
              <User className="text-gold" size={20} />
            </div>
            <div className="ml-3">
              <p className="font-medium text-white">{user?.email?.split('@')[0] || 'User'}</p>
              <p className="text-xs text-gray-300">{user?.email || 'No email'}</p>
            </div>
          </div>
          
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="mt-3 relative">
            <input
              type="text"
              placeholder="Search processes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-navy-700 text-white placeholder-gray-400 rounded-md py-1.5 pl-8 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-gold"
            />
            <Search className="absolute left-2 top-2 text-gray-400" size={14} />
            <button type="submit" className="sr-only">Search</button>
          </form>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-4 space-y-1">
            {/* Main navigation */}
            <Link 
              href="/dashboard" 
              className={`flex items-center px-2 py-2 rounded-md ${
                isActive('/dashboard') 
                  ? 'bg-navy-700 text-gold' 
                  : 'text-gray-300 hover:bg-navy-700 hover:text-white'
              }`}
            >
              <Home size={18} className="mr-3" />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              href="/dashboard/processo" 
              className={`flex items-center px-2 py-2 rounded-md ${
                pathname.startsWith('/dashboard/processo') 
                  ? 'bg-navy-700 text-gold' 
                  : 'text-gray-300 hover:bg-navy-700 hover:text-white'
              }`}
            >
              <Briefcase size={18} className="mr-3" />
              <span>My Processes</span>
            </Link>
            
            <Link 
              href="/dashboard/processo/new" 
              className={`flex items-center px-2 py-2 rounded-md ${
                isActive('/dashboard/processo/new') 
                  ? 'bg-navy-700 text-gold' 
                  : 'text-gray-300 hover:bg-navy-700 hover:text-white'
              }`}
            >
              <FileText size={18} className="mr-3" />
              <span>New Process</span>
            </Link>
            
            {/* Process type categories */}
            <div className="mt-6">
              <h3 className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Process Types
              </h3>
              
              <div className="mt-2 space-y-1">
                {Object.entries(processTypeCategories).map(([category, types]) => (
                  <div key={category}>
                    <button
                      className={`w-full flex items-center justify-between px-2 py-2 text-sm rounded-md ${
                        categoryHasActiveChild(types)
                          ? 'bg-navy-700 text-gold'
                          : 'text-gray-300 hover:bg-navy-700 hover:text-white'
                      }`}
                      onClick={() => toggleCategory(category)}
                    >
                      <div className="flex items-center">
                        <Filter size={16} className="mr-3" />
                        <span>{category}</span>
                      </div>
                      {expandedCategories[category] ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                    
                    {expandedCategories[category] && (
                      <div className="ml-6 mt-1 space-y-1">
                        {types.map(type => (
                          <Link
                            key={type}
                            href={`/dashboard/${type}`}
                            className={`flex items-center px-2 py-1.5 text-sm rounded-md ${
                              isActive(`/dashboard/${type}`)
                                ? 'bg-navy-700 text-gold'
                                : 'text-gray-300 hover:bg-navy-700 hover:text-white'
                            }`}
                          >
                            <FileText size={14} className="mr-2" />
                            <span>{processTypeLabels[type as ProcessType]}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </nav>
        
        {/* Footer */}
        <div className="p-4 border-t border-navy-700">
          <div className="space-y-2">
            <Link 
              href="/account" 
              className="flex items-center px-2 py-2 text-sm rounded-md text-gray-300 hover:bg-navy-700 hover:text-white"
            >
              <Settings size={18} className="mr-3" />
              <span>Account Settings</span>
            </Link>
            
            <Link 
              href="/help" 
              className="flex items-center px-2 py-2 text-sm rounded-md text-gray-300 hover:bg-navy-700 hover:text-white"
            >
              <HelpCircle size={18} className="mr-3" />
              <span>Help & Support</span>
            </Link>
            
            <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
              <input type="hidden" name="pathName" value={pathname || ''} />
              <button 
                type="submit"
                className="w-full flex items-center px-2 py-2 text-sm rounded-md text-gray-300 hover:bg-navy-700 hover:text-white"
              >
                <LogOut size={18} className="mr-3" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'ml-0'}`}>
        <main className="h-full overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
} 