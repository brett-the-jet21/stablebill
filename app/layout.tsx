import "./globals.css";
export const metadata = {
  title: "StableBill — Stablecoin Invoicing Made Simple",
  description:
    "Send invoices and get paid in USDC using StableBill. Fast, global, dollar-stable invoicing with no banks and no borders.",
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
