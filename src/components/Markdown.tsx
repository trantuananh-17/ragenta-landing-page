import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders trusted markdown from the content layer. Styling lives in the
 * `.prose-document` rules in globals.css so legal pages and blog posts read
 * identically and both follow the theme.
 *
 * `rehype-raw` is deliberately not enabled: raw HTML in a post body would be an
 * injection surface the moment the bodies come from a CMS.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-document">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
