/* Renders a post's block array.

   Every branch here is a real element built from data — nothing goes
   through innerHTML, so a post can never inject markup into the page and
   the CSP never needs an escape hatch to render one. */

function Code({ lang, code }) {
  return (
    <div
      className="my-5 rounded-lg overflow-hidden"
      style={{ background: 'var(--bg-alt)', border: '1px solid var(--surface-border)' }}
    >
      {lang && (
        <div
          className="px-3.5 py-1.5 text-[10.5px] font-mono uppercase tracking-[0.12em]"
          style={{ color: 'var(--text-4)', borderBottom: '1px solid var(--surface-border)' }}
        >
          {lang}
        </div>
      )}
      {/* Long lines scroll inside the block rather than widening the page. */}
      <pre className="px-3.5 py-3 overflow-x-auto text-[12.5px] leading-[1.65]">
        <code className="font-mono" style={{ color: 'var(--text-2)' }}>
          {code}
        </code>
      </pre>
    </div>
  );
}

export default function PostBody({ body }) {
  return (
    <div>
      {body.map((block, i) => {
        switch (block.type) {
          case 'h':
            return (
              <h2
                key={i}
                className="text-[17px] font-medium mt-8 mb-3"
                style={{ color: 'var(--text-1)' }}
              >
                {block.text}
              </h2>
            );
          case 'list':
            return (
              <ul key={i} className="my-4 space-y-2">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="text-[14.5px] leading-relaxed pl-4 relative"
                    style={{ color: 'var(--text-2)' }}
                  >
                    <span
                      className="absolute left-0 top-[0.62em] w-1.5 h-px"
                      style={{ background: 'var(--text-4)' }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            );
          case 'code':
            return <Code key={i} lang={block.lang} code={block.code} />;
          case 'note':
            return (
              <p
                key={i}
                className="my-5 pl-4 text-[13.5px] leading-relaxed"
                style={{ color: 'var(--text-3)', borderLeft: '2px solid var(--surface-border)' }}
              >
                {block.text}
              </p>
            );
          case 'quote':
            return (
              <p
                key={i}
                className="my-6 text-[16px] leading-relaxed font-display"
                style={{ color: 'var(--text-1)' }}
              >
                {block.text}
              </p>
            );
          default:
            return (
              <p
                key={i}
                className="my-4 text-[14.5px] leading-[1.75]"
                style={{ color: 'var(--text-2)' }}
              >
                {block.text}
              </p>
            );
        }
      })}
    </div>
  );
}
