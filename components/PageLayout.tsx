import { ReactElement, ReactNode } from 'react';

export default function PageLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): ReactElement {
  return (
    <div className="bg-background px-14 py-12">
      <h1 className="font-extrabold text-5xl">{title}</h1>
      {children}
    </div>
  );
}
