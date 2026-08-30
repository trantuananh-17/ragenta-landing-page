import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createHeadingIdResolver, reactNodeToText } from "@/lib/markdown";

/**
 * Renders trusted markdown from the content layer. Styling lives in the
 * `.prose-document` rules in globals.css so legal pages and blog posts read
 * identically and both follow the theme.
 *
 * `rehype-raw` is deliberately not enabled: raw HTML in a post body would be an
 * injection surface the moment the bodies come from a CMS.
 *
 * Headings get an anchor id from the same resolver `extractTocHeadings` uses.
 * One resolver per render, called in document order, is what makes a table of
 * contents entry and its heading agree on the duplicate suffix.
 */
export function Markdown({ children }: { children: string }) {
  const resolveHeadingId = createHeadingIdResolver();

  return (
    <div className="prose-document">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 id={resolveHeadingId(reactNodeToText(children))}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 id={resolveHeadingId(reactNodeToText(children))}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 id={resolveHeadingId(reactNodeToText(children))}>{children}</h3>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
