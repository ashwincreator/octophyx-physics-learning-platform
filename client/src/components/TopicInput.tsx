import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Search, Sparkles } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { VoiceRecorder } from "./VoiceRecorder";

interface TopicInputProps {
  onSubmit: (topic: string) => void;
  isLoading?: boolean;
}

export function TopicInput({ onSubmit, isLoading = false }: TopicInputProps) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [debouncedInput, setDebouncedInput] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(input);
    }, 300);
    return () => clearTimeout(timer);
  }, [input]);

  const { data: suggestions = [] } = trpc.physics.searchTopics.useQuery(
    { query: debouncedInput },
    { enabled: debouncedInput.length > 0 }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSubmit(input.trim());
      setInput("");
      setOpen(false);
    }
  };

  const handleSelectSuggestion = (topic: string) => {
    setInput(topic);
    setOpen(false);
    onSubmit(topic);
  };

  const handleVoiceTranscription = (text: string) => {
    setInput(text);
    onSubmit(text);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative flex gap-2">
        <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              <Input
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                placeholder="Enter a physics topic (e.g., Newton's Laws, Quantum Tunneling)..."
                className="pl-10 pr-4 h-14 text-lg bg-card border-2 border-border focus:border-primary transition-colors"
                disabled={isLoading}
              />
            </div>
          </PopoverTrigger>
          <PopoverContent 
            className="w-[var(--radix-popover-trigger-width)] p-0 bg-card border-2 border-border" 
            align="start"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Command className="bg-transparent">
              <CommandList>
                <CommandEmpty>No topics found.</CommandEmpty>
                <CommandGroup>
                  {suggestions.map((topic) => (
                    <CommandItem
                      key={topic.id}
                      value={topic.name}
                      onSelect={() => handleSelectSuggestion(topic.name)}
                      className="cursor-pointer hover:bg-accent"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{topic.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">{topic.category}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        
        <VoiceRecorder onTranscription={handleVoiceTranscription} />
        
        <Button 
          type="submit" 
          size="lg" 
          disabled={!input.trim() || isLoading}
          className="h-14 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Generate
        </Button>
      </div>
      
      <p className="text-sm text-muted-foreground mt-3 text-center">
        Type a physics concept or use voice input for hands-free learning
      </p>
    </form>
  );
}
