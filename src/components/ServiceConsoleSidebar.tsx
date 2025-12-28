import { motion } from 'framer-motion';
import { 
  Shield, 
  LayoutDashboard, 
  FileWarning, 
  AlertTriangle, 
  TrendingUp, 
  Settings,
  Users,
  BookOpen,
  BarChart3,
  Clock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  badgeVariant?: 'default' | 'warning' | 'danger';
}

const navigationItems: NavItem[] = [
  { id: 'dashboard', label: 'Risk Command', icon: LayoutDashboard },
  { id: 'cases', label: 'Active Cases', icon: FileWarning, badge: 15 },
  { id: 'critical', label: 'Critical Queue', icon: AlertTriangle, badge: 3, badgeVariant: 'danger' },
  { id: 'sla', label: 'SLA Monitor', icon: Clock, badge: 2, badgeVariant: 'warning' },
  { id: 'escalations', label: 'Escalations', icon: TrendingUp, badge: 4 },
];

const analyticsItems: NavItem[] = [
  { id: 'patterns', label: 'Pattern Detection', icon: BarChart3 },
  { id: 'authorities', label: 'Decision Makers', icon: Users },
  { id: 'policies', label: 'Policy Library', icon: BookOpen },
];

interface ServiceConsoleSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function ServiceConsoleSidebar({ 
  activeTab, 
  onTabChange, 
  collapsed = false,
  onToggleCollapse 
}: ServiceConsoleSidebarProps) {
  const badgeColors = {
    default: 'bg-primary/20 text-primary',
    warning: 'bg-amber-500/20 text-amber-400',
    danger: 'bg-red-500/20 text-red-400'
  };

  const renderNavItem = (item: NavItem) => {
    const isActive = activeTab === item.id;
    
    return (
      <motion.button
        key={item.id}
        onClick={() => onTabChange(item.id)}
        className={cn(
          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200',
          'hover:bg-muted/50',
          isActive && 'bg-primary/10 text-primary border-l-2 border-primary'
        )}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
      >
        <item.icon className={cn(
          'w-5 h-5 flex-shrink-0',
          isActive ? 'text-primary' : 'text-muted-foreground'
        )} />
        
        {!collapsed && (
          <>
            <span className={cn(
              'flex-1 text-left',
              isActive ? 'font-medium' : 'text-muted-foreground'
            )}>
              {item.label}
            </span>
            
            {item.badge !== undefined && (
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs font-mono font-medium',
                badgeColors[item.badgeVariant || 'default']
              )}>
                {item.badge}
              </span>
            )}
          </>
        )}
      </motion.button>
    );
  };

  return (
    <motion.aside
      className={cn(
        'h-full bg-sidebar border-r border-sidebar-border flex flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <div className={cn(
        'p-4 border-b border-sidebar-border flex items-center gap-3',
        collapsed && 'justify-center'
      )}>
        <motion.div 
          className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 400 }}
        >
          <Shield className="w-6 h-6 text-primary-foreground" />
        </motion.div>
        
        {!collapsed && (
          <div className="min-w-0">
            <h1 className="text-lg font-bold tracking-tight truncate">AERAS</h1>
            <p className="text-[10px] text-muted-foreground truncate">
              Service Console
            </p>
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Case Management
            </p>
          )}
          {navigationItems.map(renderNavItem)}
        </div>

        <div className="space-y-1">
          {!collapsed && (
            <p className="px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              Analytics
            </p>
          )}
          {analyticsItems.map(renderNavItem)}
        </div>
      </div>

      {/* System Status */}
      {!collapsed && (
        <div className="p-3 border-t border-sidebar-border">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">System Active</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              All integrations operational
            </p>
          </div>
        </div>
      )}

      {/* Settings & Collapse */}
      <div className="p-3 border-t border-sidebar-border flex items-center gap-2">
        {!collapsed && (
          <Button variant="ghost" size="sm" className="flex-1 justify-start gap-2">
            <Settings className="w-4 h-4" />
            <span className="text-sm">Settings</span>
          </Button>
        )}
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onToggleCollapse}
          className="flex-shrink-0"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>
    </motion.aside>
  );
}
