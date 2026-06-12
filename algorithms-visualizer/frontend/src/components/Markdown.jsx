import ReactMarkdown from "react-markdown";

const components = {
  h1: (props) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
  h2: (props) => <h2 className="text-xl font-bold mt-4 mb-2" {...props} />,
  h3: (props) => <h3 className="text-lg font-semibold mt-3 mb-2" {...props} />,
  p: (props) => <p className="my-2 leading-relaxed" {...props} />,
  ul: (props) => <ul className="list-disc pl-6 my-2 space-y-1" {...props} />,
  ol: (props) => <ol className="list-decimal pl-6 my-2 space-y-1" {...props} />,
  a: (props) => <a className="text-violet-400 hover:underline" {...props} />,
  blockquote: (props) => (
    <blockquote className="border-l-2 border-violet-500 pl-3 my-2 text-obsidian-muted italic" {...props} />
  ),
  code({ className, children, ...props }) {
    const isBlock = /language-/.test(className || "") || String(children).includes("\n");
    return isBlock ? (
      <code className="block p-3 my-2 rounded-lg bg-obsidian-elevated overflow-x-auto text-sm" {...props}>
        {children}
      </code>
    ) : (
      <code className="px-1.5 py-0.5 rounded bg-obsidian-elevated text-violet-300 text-sm" {...props}>
        {children}
      </code>
    );
  },
};

export default function Markdown({ children }) {
  return (
    <div className="text-obsidian-text break-words">
      <ReactMarkdown components={components}>{children || ""}</ReactMarkdown>
    </div>
  );
}