'use client';

import { useState } from 'react';
import { FileText, Save, Code2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface NotesSectionProps {
  notes: string;
  onUpdate: (notes: string) => void;
}

export function NotesSection({ notes, onUpdate }: NotesSectionProps) {
  const [localNotes, setLocalNotes] = useState(notes);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onUpdate(localNotes);
    setIsSaving(false);
  };

  return (
    <Card className="bg-gradient-to-br from-slate-950/95 via-slate-900/95 to-slate-950/95 backdrop-blur-xl border border-green-500/20 shadow-2xl shadow-green-500/10">
      {/* Code-like background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-4 left-4 font-mono text-xs text-green-400">
          {'// NOTES_BUFFER'}
        </div>
        <div className="absolute top-8 left-4 font-mono text-xs text-slate-500">
          {'const notes = new NotesManager();'}
        </div>
        <div className="absolute bottom-4 right-4 font-mono text-xs text-slate-500">
          {'notes.autoSave = true;'}
        </div>
      </div>

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-6">
          <Code2 className="h-6 w-6 text-green-400" />
          <h2 className="text-2xl font-bold text-slate-200 font-mono">
            DEV_NOTES.md
          </h2>
          <BookOpen className="h-5 w-5 text-green-400" />
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg blur-sm" />
            <div className="relative bg-slate-900/80 border border-green-500/30 rounded-lg overflow-hidden">
              <div className="bg-slate-800/50 px-4 py-2 border-b border-green-500/20">
                <div className="flex items-center gap-2 text-xs font-mono text-green-400">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="ml-2">notes.md - Important Development Notes</span>
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs text-green-400 mb-2 font-mono">
                  {'> editor.write()'}
                </div>
                <Textarea
                  value={localNotes}
                  onChange={(e) => setLocalNotes(e.target.value)}
                  placeholder={`# Development Notes

## Current Sprint
- [ ] Feature implementation
- [ ] Bug fixes
- [ ] Code review

## Ideas & Reminders
- Performance optimizations
- Refactoring opportunities
- Technical debt items

## Meeting Notes
- Team sync updates
- Architecture decisions
- Next steps...`}
                  className="min-h-[300px] bg-transparent border-0 text-slate-200 placeholder-slate-500 resize-none focus:ring-0 focus:outline-none font-mono text-sm leading-relaxed"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-xs font-mono text-slate-500">
              {'// Auto-sync enabled across all devices'}
            </div>
            <Button
              onClick={handleSave}
              disabled={isSaving || localNotes === notes}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 shadow-lg hover:shadow-green-500/25 transition-all duration-300 disabled:opacity-50 font-mono"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  notes.save()
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  notes.save()
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}