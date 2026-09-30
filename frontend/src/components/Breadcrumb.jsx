import { Link } from 'react-router-dom';

/**
 * Semantic Silo Breadcrumb Navigation
 * Generates semantic microdata schema elements and visual breadcrumb links.
 */
export default function Breadcrumb({ items = [] }) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="py-3 px-4 md:px-6 bg-slate-100/80 border-b border-slate-200 text-xs md:text-sm"
    >
      <div className="max-w-7xl mx-auto">
        <ol
          className="flex flex-wrap items-center gap-1.5 md:gap-2 text-slate-600 font-medium"
          itemScope
          itemType="https://schema.org/BreadcrumbList"
        >
          <li
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
            className="flex items-center gap-1.5 md:gap-2"
          >
            <Link
              to="/"
              itemProp="item"
              className="text-slate-600 hover:text-[#0a1e40] transition flex items-center gap-1"
            >
              <span className="text-sm">🏠</span>
              <span itemProp="name">Home</span>
            </Link>
            <meta itemProp="position" content="1" />
            <span className="text-slate-400 select-none">/</span>
          </li>

          {items.map((it, idx) => {
            const isLast = idx === items.length - 1;
            const position = idx + 2;

            return (
              <li
                key={it.name}
                itemProp="itemListElement"
                itemScope
                itemType="https://schema.org/ListItem"
                className="flex items-center gap-1.5 md:gap-2"
              >
                {isLast || !it.url ? (
                  <span
                    itemProp="name"
                    aria-current="page"
                    className="font-bold text-[#0a1e40] truncate max-w-[200px] sm:max-w-xs md:max-w-md"
                  >
                    {it.name}
                  </span>
                ) : (
                  <>
                    <Link
                      to={it.url}
                      itemProp="item"
                      className="text-slate-600 hover:text-[#1e4a9a] transition truncate max-w-[150px] sm:max-w-none"
                    >
                      <span itemProp="name">{it.name}</span>
                    </Link>
                    <span className="text-slate-400 select-none">/</span>
                  </>
                )}
                <meta itemProp="position" content={String(position)} />
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
