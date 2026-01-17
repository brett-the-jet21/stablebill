export default function Home() {
  return (
    <main className="container">

      <header className="header">
        <strong>StableBill</strong>
        <nav>
          <a href="#how">How it works</a>
          <a href="#">FAQ</a>
          <a href="#">Create invoice</a>
        </nav>
      </header>

      <section className="hero">
        <h1>
          Get paid in stablecoins.
          <br />
          Without banks.
        </h1>
        <p>
          Send invoices. Get paid in USDC.
          No borders, no chargebacks, no custody.
        </p>

        <div className="cta">
          <button className="btn primary">Create invoice</button>
          <button className="btn">See how it works</button>
        </div>
      </section>

      <section className="features">
        <div>
          <strong>Non-custodial</strong>
          <span>Funds go straight to you</span>
        </div>
        <div>
          <strong>Instant</strong>
          <span>Paid in minutes</span>
        </div>
        <div>
          <strong>Global</strong>
          <span>Any country, anytime</span>
        </div>
      </section>

      <section className="invoice-wrap">
        <div>
          <h2>Invoice preview</h2>
          <p className="muted">What your customer sees.</p>
        </div>

        <div className="invoice">
          <h3>Invoice</h3>

          <div className="row">
            <span>Description</span>
            <span>Software consulting — March</span>
          </div>

          <div className="row">
            <span>Network</span>
            <span>Ethereum / Solana</span>
          </div>

          <div className="row">
            <span>Currency</span>
            <span>USDC</span>
          </div>

          <div className="total">$2,400.00</div>

          <button className="btn primary">Pay invoice</button>
        </div>
      </section>

      <section id="how" className="how">
        <h2>How it works</h2>

        <div className="steps">
          <div>
            <h4>1. Create</h4>
            <p>Enter amount, memo, and wallet.</p>
          </div>
          <div>
            <h4>2. Send</h4>
            <p>Share the invoice link.</p>
          </div>
          <div>
            <h4>3. Get paid</h4>
            <p>Funds arrive instantly.</p>
          </div>
        </div>
      </section>

      <footer>
        © StableBill — Stablecoin invoicing
      </footer>

    </main>
  );
}
