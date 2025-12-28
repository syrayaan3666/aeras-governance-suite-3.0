import { motion } from 'framer-motion';
import { 
  Shield, 
  Activity, 
  Bell,
  Settings,
  Search,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CommandHeaderProps {
  className?: string;
}

export function CommandHeader({ className }: CommandHeaderProps) {
  return (
    <motion.header
      className={cn('command-header', className)}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-cyan-600 flex items-center justify-center shadow-lg shadow-primary/20"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Shield className="w-6 h-6 text-primary-foreground" />
              </motion.div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">AERAS</h1>
                <p className="text-xs text-muted-foreground">
                  Academic Exception Risk & Accountability System
                </p>
              </div>
            </div>
          </div>
          
          {/* Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search cases, policies, or departments..."
                className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50"
              />
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Activity className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </Button>
            
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold flex items-center justify-center">
                3
              </span>
            </Button>
            
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            
            <div className="w-px h-8 bg-border/50 mx-2" />
            
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">Compliance Officer</p>
                <p className="text-xs text-muted-foreground">Academic Affairs</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 border border-primary/30 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">CO</span>
              </div>
            </div>
            
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
