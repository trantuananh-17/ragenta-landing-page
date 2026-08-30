// Renders a JSON-LD structured-data block. Escapes `<` so a stray `</script>`
// in any string value can't break out of the script element.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
