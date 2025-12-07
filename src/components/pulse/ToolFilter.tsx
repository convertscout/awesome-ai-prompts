import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Tool {
  id: string;
  name: string;
  logo_url?: string;
  brand_color: string;
}

interface ToolFilterProps {
  tools: Tool[];
  selectedTools: string[];
  onToggle: (toolId: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
}

export const ToolFilter = ({ 
  tools, 
  selectedTools, 
  onToggle, 
  onSelectAll, 
  onClearAll 
}: ToolFilterProps) => {
  const allSelected = selectedTools.length === tools.length;
  const noneSelected = selectedTools.length === 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground mr-2">Filter:</span>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={allSelected ? onClearAll : onSelectAll}
        className="text-xs"
      >
        {allSelected ? 'Clear All' : 'Select All'}
      </Button>

      {tools.map((tool) => {
        const isSelected = selectedTools.includes(tool.id);
        
        return (
          <button
            key={tool.id}
            onClick={() => onToggle(tool.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all ${
              isSelected 
                ? 'bg-primary/20 border border-primary/50' 
                : 'bg-secondary/50 border border-border hover:border-primary/30'
            }`}
          >
            {tool.logo_url ? (
              <img src={tool.logo_url} alt={tool.name} className="h-4 w-4 rounded" />
            ) : (
              <div 
                className="h-4 w-4 rounded flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: tool.brand_color }}
              >
                {tool.name.charAt(0)}
              </div>
            )}
            <span className={isSelected ? 'text-foreground' : 'text-muted-foreground'}>
              {tool.name}
            </span>
            {isSelected && <Check className="h-3 w-3 text-primary" />}
          </button>
        );
      })}
    </div>
  );
};
