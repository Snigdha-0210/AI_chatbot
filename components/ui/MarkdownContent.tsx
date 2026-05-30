"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => (
          <strong className="font-semibold text-on-surface">{children}</strong>
        ),
        em: ({ children }) => <em className="italic">{children}</em>,
        h1: ({ children }) => (
          <h1 className="mb-2 mt-4 text-lg font-bold text-on-surface first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="mb-2 mt-3 text-base font-bold text-on-surface first:mt-0">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="mb-1 mt-2 text-sm font-semibold text-on-surface first:mt-0">
            {children}
          </h3>
        ),
        ul: ({ children }) => (
          <ul className="mb-2 list-disc space-y-1 pl-5">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="mb-2 list-decimal space-y-1 pl-5">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        code: ({ className, children, ...rest }) => {
          const isInline = !className;
          if (isInline) {
            return (
              <code className="rounded bg-surface-container-high/80 px-1.5 py-0.5 font-mono text-xs text-primary">
                {children}
              </code>
            );
          }
          return (
            <code
              className={`block overflow-x-auto rounded-lg bg-surface-deep/80 p-3 font-mono text-xs leading-relaxed ${className ?? ""}`}
              {...rest}
            >
              {children}
            </code>
          );
        },
        pre: ({ children }) => <pre className="mb-2">{children}</pre>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline decoration-primary/40 underline-offset-2 transition hover:decoration-primary"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="mb-2 border-l-2 border-primary/30 pl-3 italic text-on-surface-variant">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="my-3 border-white/10" />,
        table: ({ children }) => (
          <div className="mb-2 overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="border-b border-white/10 bg-surface-container/50">
            {children}
          </thead>
        ),
        th: ({ children }) => (
          <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-3 py-2 text-on-surface">{children}</td>
        ),
        tr: ({ children }) => (
          <tr className="border-b border-white/5 last:border-0">{children}</tr>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
