import React from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Lightbulb, BookMarked } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Professional markdown renderer with LaTeX/KaTeX support
 * Handles headings, lists, code blocks, and mathematical expressions
 */
export function ImprovedMarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (!line.trim()) {
      elements.push(<div key={`empty-${i}`} className="h-2" />);
      i++;
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${i}`} className="text-3xl font-bold mt-6 mb-4 text-foreground">
          {renderInlineContent(line.substring(2))}
        </h1>
      );
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${i}`} className="text-2xl font-bold mt-5 mb-3 text-foreground">
          {renderInlineContent(line.substring(3))}
        </h2>
      );
      i++;
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${i}`} className="text-xl font-bold mt-4 mb-2 text-foreground">
          {renderInlineContent(line.substring(4))}
        </h3>
      );
      i++;
      continue;
    }

    // Code blocks
    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      const language = line.substring(3).trim();
      i++;

      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }

      elements.push(
        <div key={`code-${i}`} className="my-4 rounded-lg border border-border overflow-hidden">
          {language && (
            <div className="bg-background/50 px-4 py-2 border-b border-border text-xs text-muted-foreground font-mono">
              {language}
            </div>
          )}
          <pre className="bg-background/80 p-4 overflow-x-auto">
            <code className="text-sm text-foreground font-mono whitespace-pre-wrap break-words">
              {codeLines.join('\n')}
            </code>
          </pre>
        </div>
      );
      i++;
      continue;
    }

    // Block math ($$...$$)
    if (line.startsWith('$$')) {
      const mathLines: string[] = [line.substring(2)];
      i++;

      while (i < lines.length && !lines[i].includes('$$')) {
        mathLines.push(lines[i]);
        i++;
      }

      if (i < lines.length) {
        mathLines[mathLines.length - 1] = mathLines[mathLines.length - 1].replace('$$', '');
        if (lines[i].includes('$$')) {
          const remaining = lines[i].substring(lines[i].indexOf('$$') + 2);
          if (remaining) mathLines[mathLines.length - 1] += remaining;
        }
      }

      const mathContent = mathLines.join('\n').trim();

      try {
        elements.push(
          <div key={`blockmath-${i}`} className="my-4 p-4 bg-background/50 rounded-lg border border-primary/30 overflow-x-auto">
            <BlockMath math={mathContent} />
          </div>
        );
      } catch (e) {
        elements.push(
          <div key={`blockmath-error-${i}`} className="my-4 p-4 bg-red-500/10 rounded-lg border border-red-500/30">
            <code className="text-red-400 text-sm">{mathContent}</code>
          </div>
        );
      }

      i++;
      continue;
    }

    // Unordered lists
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems: string[] = [];

      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listItems.push(lines[i].substring(2));
        i++;
      }

      elements.push(
        <ul key={`ul-${i}`} className="list-disc list-inside space-y-2 my-3 text-foreground">
          {listItems.map((item, idx) => (
            <li key={idx} className="ml-2">
              {renderInlineContent(item)}
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered lists
    if (/^\d+\. /.test(line)) {
      const listItems: string[] = [];

      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        listItems.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }

      elements.push(
        <ol key={`ol-${i}`} className="list-decimal list-inside space-y-2 my-3 text-foreground">
          {listItems.map((item, idx) => (
            <li key={idx} className="ml-2">
              {renderInlineContent(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];

      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].substring(2));
        i++;
      }

      elements.push(
        <div key={`quote-${i}`} className="my-4 pl-4 border-l-4 border-primary/50 bg-primary/5 p-4 rounded">
          <p className="text-foreground italic">{quoteLines.join(' ')}</p>
        </div>
      );
      continue;
    }

    // Regular paragraphs
    elements.push(
      <p key={`p-${i}`} className="text-foreground leading-relaxed my-3">
        {renderInlineContent(line)}
      </p>
    );
    i++;
  }

  return <div className={`space-y-2 ${className}`}>{elements}</div>;
}

/**
 * Renders inline content with support for:
 * - Bold (**text**)
 * - Italic (*text*)
 * - Code (`text`)
 * - Inline math ($math$)
 * - Links ([text](url))
 */
function renderInlineContent(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Combined regex for all inline elements
  const patterns = [
    { regex: /\$([^\$]+)\$/g, type: 'math' },
    { regex: /\*\*([^\*]+)\*\*/g, type: 'bold' },
    { regex: /\*([^\*]+)\*/g, type: 'italic' },
    { regex: /`([^`]+)`/g, type: 'code' },
    { regex: /\[([^\]]+)\]\(([^)]+)\)/g, type: 'link' },
  ];

  // Find all matches
  const matches: Array<{ index: number; length: number; type: string; content: string; url?: string }> = [];

  patterns.forEach((pattern) => {
    let match;
    const regex = new RegExp(pattern.regex);
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
        type: pattern.type,
        content: match[1],
        url: match[2],
      });
    }
  });

  // Sort by index
  matches.sort((a, b) => a.index - b.index);

  // Remove overlapping matches
  const filtered = matches.filter((match, idx) => {
    if (idx === 0) return true;
    const prev = matches[idx - 1];
    return match.index >= prev.index + prev.length;
  });

  // Render
  filtered.forEach((match) => {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    switch (match.type) {
      case 'math':
        try {
          parts.push(
            <span key={`math-${match.index}`} className="inline-math">
              <InlineMath math={match.content} />
            </span>
          );
        } catch (e) {
          parts.push(<code key={`math-error-${match.index}`}>{match.content}</code>);
        }
        break;
      case 'bold':
        parts.push(
          <strong key={`bold-${match.index}`} className="font-bold text-primary">
            {match.content}
          </strong>
        );
        break;
      case 'italic':
        parts.push(
          <em key={`italic-${match.index}`} className="italic">
            {match.content}
          </em>
        );
        break;
      case 'code':
        parts.push(
          <code key={`code-${match.index}`} className="bg-background/50 px-2 py-1 rounded font-mono text-sm text-accent">
            {match.content}
          </code>
        );
        break;
      case 'link':
        parts.push(
          <a
            key={`link-${match.index}`}
            href={match.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {match.content}
          </a>
        );
        break;
    }

    lastIndex = match.index + match.length;
  });

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

/**
 * Special card for displaying physics concepts with proper formatting
 */
export function PhysicsConceptCard({
  title,
  content,
  type = 'concept',
}: {
  title: string;
  content: string;
  type?: 'concept' | 'warning' | 'tip' | 'example';
}) {
  const icons = {
    concept: <Lightbulb className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    tip: <BookMarked className="h-5 w-5" />,
    example: <BookMarked className="h-5 w-5" />,
  };

  const colors = {
    concept: 'border-primary/30 bg-primary/5',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
    tip: 'border-green-500/30 bg-green-500/5',
    example: 'border-blue-500/30 bg-blue-500/5',
  };

  return (
    <Card className={`border-2 ${colors[type]} backdrop-blur p-4 my-4`}>
      <div className="flex items-start gap-3">
        <div className="text-primary mt-1">{icons[type]}</div>
        <div className="flex-1">
          <h4 className="font-bold text-foreground mb-2">{title}</h4>
          <ImprovedMarkdownRenderer content={content} />
        </div>
      </div>
    </Card>
  );
}
