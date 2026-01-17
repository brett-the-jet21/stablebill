export default function Home() {
  return (
    <main style={styles.main}>
      <section style={styles.hero}>
        <h1 style={styles.h1}>Get Paid in Stablecoins, Simply</h1>
        <p style={styles.sub}>
          Send invoices. Get paid in USDC. No banks. No borders.
        </p>
        <a href="#" style={styles.cta}>Create an Invoice</a>
        <p style={styles.note}>App launching soon</p>
      </section>

      <section style={styles.section}>
        <h2>What Is Stablecoin Invoicing?</h2>
        <p>
          Stablecoin invoicing lets you bill clients in U.S. dollar-pegged digital
          currency instead of traditional bank rails.
        </p>
        <p>
          With StableBill, you create an invoice in USD, share a payment link,
          and get paid in USDC directly to your wallet.
        </p>
      </section>

      <section style={styles.section}>
        <h2>Why Use StableBill?</h2>
        <ul>
          <li>🌍 Global payments, instantly</li>
          <li>💵 Dollar-stable pricing</li>
          <li>⚡ Faster than wire transfers</li>
          <li>🧾 Built for invoicing — not trading</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2>Who It’s For</h2>
        <p>
          Freelancers, contractors, agencies, and businesses that want to get
          paid globally without banking friction.
        </p>
      </section>

      <section style={styles.section}>
        <h2>How It Works</h2>
        <ol>
          <li>Create an invoice</li>
          <li>Share the payment link</li>
          <li>Get paid in USDC</li>
        </ol>
      </section>

      <section style={styles.section}>
        <h2>Important Notes</h2>
        <p>
          StableBill is a non-custodial invoicing platform. We do not store funds,
          operate wallets, or provide financial advice.
        </p>
      </section>

      <footer style={styles.footer}>
        <p>© {new Date().getFullYear()} StableBill.io</p>
      </footer>
    </main>
  );
}

const styles: any = {
  main: {
    fontFamily: "system-ui, sans-serif",
    maxWidth: "900px",
    margin: "0 auto",
    padding: "40px 20px",
    lineHeight: 1.6,
  },
  hero: {
    textAlign: "center",
    marginBottom: "60px",
  },
  h1: {
    fontSize: "2.5rem",
    marginBottom: "12px",
  },
  sub: {
    fontSize: "1.2rem",
    marginBottom: "20px",
  },
  cta: {
    display: "inline-block",
    padding: "14px 28px",
    background: "#000",
    color: "#fff",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: 600,
  },
  note: {
    marginTop: "10px",
    color: "#666",
  },
  section: {
    marginBottom: "48px",
  },
  footer: {
    borderTop: "1px solid #eee",
    paddingTop: "20px",
    color: "#777",
    fontSize: "0.9rem",
  },
};
