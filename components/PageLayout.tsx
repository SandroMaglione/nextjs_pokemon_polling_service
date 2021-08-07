import { ReactElement, ReactNode } from 'react';

export default function PageLayout({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): ReactElement {
  return (
    <div className="min-h-screen py-12 bg-background px-14">
      <h1 className="text-5xl font-extrabold">{title}</h1>
      {children}
    </div>
  );
}
