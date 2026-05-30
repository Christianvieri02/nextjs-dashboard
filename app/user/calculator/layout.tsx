import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kalkulator Tarif',
  description: 'Calculate shipment tariffs based on weight and type.',
};

export default function CalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
