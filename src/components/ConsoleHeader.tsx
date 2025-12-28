import { motion } from 'framer-motion';
import { 
  Activity, 
  Bell,
  Settings,
  Search,
  HelpCircle,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ConsoleHeaderProps {
  className?: string;
}

export function ConsoleHeader({ className }: ConsoleHeaderProps) {
  return (
    <motion.header
      className={cn('h-14 bg-card border-b border-border/50 flex items-center px-4 gap-4', className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 mr-4">
        <img 
          src="/logo.png" 
          alt="AERAS Governance Suite" 
          className="h-12 w-auto"
        />
        <div className="hidden sm:block">
          <h1 className="text-lg font-semibold text-primary">AERAS</h1>
          <p className="text-xs text-muted-foreground">Governance Suite</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search cases, policies, or departments..."
            className="pl-9 bg-muted/30 border-border/50 h-9 text-sm"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Activity className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </Button>
        
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="w-4 h-4" />
          <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-[9px] font-bold flex items-center justify-center">
            3
          </span>
        </Button>

        <Button variant="ghost" size="icon" className="h-9 w-9">
          <HelpCircle className="w-4 h-4" />
        </Button>
        
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="w-4 h-4" />
        </Button>
        
        <div className="w-px h-6 bg-border/50 mx-2" />
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-medium">Compliance Officer</p>
            <p className="text-[10px] text-muted-foreground">Academic Affairs</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-cyan-500/20 border border-primary/30 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary">CO</span>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
