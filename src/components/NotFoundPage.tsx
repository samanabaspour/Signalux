import { ArrowLeft, Home } from 'lucide-react';
import { ROUTE_PATHS } from '../utils/router';

interface NotFoundPageProps {
  title?: string;
  description?: string;
  browseHref?: string;
  browseLabel?: string;
}

export function NotFoundPage({
  title = 'صفحه پیدا نشد',
  description = 'نشانی این صفحه ممکن است تغییر کرده باشد.',
  browseHref = ROUTE_PATHS.services,
  browseLabel = 'مشاهدهٔ خدمات',
}: NotFoundPageProps) {
  const actionClass = 'inline-flex min-h-11 items-center justify-center gap-2 rounded-[5px] border px-5 py-2.5 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-300';

  return (
    <main aria-labelledby="not-found-title" className="relative grid min-h-[75vh] place-items-center overflow-hidden bg-[#070609] px-4 pb-16 pt-32 sm:px-6 sm:pt-36">
      <div aria-hidden="true" className="pointer-events-none absolute top-1/4 size-72 rounded-full bg-amber-500/10 blur-[100px]" />
      <div className="glass-card relative w-full max-w-2xl overflow-hidden rounded-[5px] border border-amber-500/25 px-5 py-10 text-center sm:px-12 sm:py-14">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
        <div aria-hidden="true" className="bg-gradient-to-b from-amber-200 via-amber-400 to-yellow-600 bg-clip-text text-7xl font-black leading-none text-transparent sm:text-8xl">۴۰۴</div>
        <h1 id="not-found-title" className="mt-5 text-2xl font-black text-white sm:text-4xl">{title}</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-amber-100/75 sm:text-base">{description}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a href={ROUTE_PATHS.home} className={actionClass + ' border-amber-400 bg-amber-400 text-slate-950 hover:bg-amber-300'}>
            <Home aria-hidden="true" className="size-4" />
            صفحهٔ اصلی
          </a>
          <a href={browseHref} className={actionClass + ' border-amber-500/25 bg-[#121017] text-amber-100 hover:border-amber-400'}>
            {browseLabel}
            <ArrowLeft aria-hidden="true" className="size-4" />
          </a>
        </div>
      </div>
    </main>
  );
}
