import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { Card } from '@/components/ui/card';

interface MathRendererProps {
  content: string;
  isBlock?: boolean;
  className?: string;
}

/**
 * Renders mathematical expressions using KaTeX
 * Supports both inline ($...$) and block ($$...$$) notation
 */
export function MathRenderer({ content, isBlock = false, className = '' }: MathRendererProps) {
  try {
    if (isBlock) {
      return (
        <div className={`my-4 p-4 bg-background/50 rounded-lg border border-border overflow-x-auto ${className}`}>
          <BlockMath math={content} />
        </div>
      );
    }
    return <InlineMath math={content} />;
  } catch (error) {
    console.error('Math rendering error:', error);
    return <code className="text-red-400">{content}</code>;
  }
}

/**
 * Parses and renders mixed markdown + LaTeX content
 * Handles both inline and block math expressions
 */
export function RichMathContent({ content }: { content: string }) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  // Regex to match both inline ($...$) and block ($$...$$) math
  const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^\$]*\$)/g;
  let match;

  while ((match = mathRegex.exec(content)) !== null) {
    // Add text before math
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`} className="text-foreground">
          {content.substring(lastIndex, match.index)}
        </span>
      );
    }

    // Add math
    const mathContent = match[0];
    const isBlock = mathContent.startsWith('$$');
    const mathExpression = mathContent.slice(isBlock ? 2 : 1, -(isBlock ? 2 : 1));

    if (isBlock) {
      parts.push(
        <div key={`math-${match.index}`} className="my-4 p-4 bg-background/50 rounded-lg border border-border overflow-x-auto">
          <BlockMath math={mathExpression} />
        </div>
      );
    } else {
      parts.push(
        <span key={`math-${match.index}`} className="inline-math">
          <InlineMath math={mathExpression} />
        </span>
      );
    }

    lastIndex = match.index + mathContent.length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(
      <span key={`text-${lastIndex}`} className="text-foreground">
        {content.substring(lastIndex)}
      </span>
    );
  }

  return <div className="space-y-2">{parts}</div>;
}

/**
 * Displays a formula card with proper formatting
 */
export function FormulaCard({
  title,
  formula,
  description,
  variables,
}: {
  title: string;
  formula: string;
  description?: string;
  variables?: { symbol: string; meaning: string }[];
}) {
  return (
    <Card className="border-2 border-border bg-card/50 backdrop-blur p-4">
      <h3 className="font-bold text-lg mb-3 text-foreground">{title}</h3>

      {/* Main Formula */}
      <div className="my-4 p-4 bg-background/50 rounded-lg border border-primary/30">
        <BlockMath math={formula} />
      </div>

      {/* Description */}
      {description && <p className="text-sm text-muted-foreground mb-4">{description}</p>}

      {/* Variables */}
      {variables && variables.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm font-semibold text-foreground mb-3">Variables:</p>
          <div className="space-y-2">
            {variables.map((variable, idx) => (
              <div key={idx} className="flex gap-3 text-sm">
                <span className="font-mono text-primary min-w-fit">{variable.symbol}</span>
                <span className="text-muted-foreground">{variable.meaning}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

/**
 * Displays quantum state notation with proper formatting
 */
export function QuantumStateCard({
  title,
  state,
  description,
}: {
  title: string;
  state: string;
  description?: string;
}) {
  return (
    <Card className="border-2 border-border bg-card/50 backdrop-blur p-4">
      <h3 className="font-bold text-lg mb-3 text-foreground">{title}</h3>

      {/* Quantum State */}
      <div className="my-4 p-4 bg-background/50 rounded-lg border border-accent/30">
        <BlockMath math={state} />
      </div>

      {/* Description */}
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </Card>
  );
}
