import type { PropsWithChildren } from 'react';

export function Page({ children }: PropsWithChildren) {
  return <div className="flex flex-col gap-4 py-15">{children}</div>;
}

export function PageContent({ children }: PropsWithChildren) {
  return <div className="px-4">{children}</div>;
}

export function PageHeader({ children }: PropsWithChildren) {
  return <div className="py-4 pr-4 pl-12">{children}</div>;
}
