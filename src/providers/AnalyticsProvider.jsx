import { Analytics } from '@vercel/analytics/react';

export function AnalyticsProvider({ children }) {
  return (
    <>
      {children}
      <Analytics />
    </>
  );
}