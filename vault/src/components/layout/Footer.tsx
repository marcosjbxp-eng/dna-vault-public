import Link from "next/link";

const NAV = {
  Loja: [
    { label: "Catálogo", href: "/store" },
    { label: "Lançamentos", href: "/store?filter=new" },
    { label: "Promoções", href: "/store?filter=promo" },
    { label: "Minha biblioteca", href: "/library" },
  ],
  Suporte: [
    { label: "Como funciona", href: "#" },
    { label: "Reembolso", href: "#" },
    { label: "Contato", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  Legal: [
    { label: "Termos de uso", href: "#" },
    { label: "Privacidade", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[--border] bg-[--void] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="w-9 h-9 bg-[--flare] flex items-center justify-center">
                <span className="text-[--void] font-black text-base">V</span>
              </div>
              <span className="text-[--white] font-black text-2xl tracking-tight">
                VAULT
              </span>
            </Link>
            <p className="text-sm text-[--smoke] mt-5 max-w-xs leading-relaxed">
              Loja brasileira de keys digitais. Catálogo curado, pagamento por
              PIX, entrega na hora.
            </p>

            <div className="mt-6 inline-flex items-center gap-3 px-3 py-2 border border-[--border] bg-[--surface]/60">
              <span className="w-2 h-2 bg-[--success] rounded-full animate-pulse" />
              <span className="font-mono text-[11px] text-[--smoke] tracking-wider">
                SISTEMA OPERACIONAL
              </span>
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(NAV).map(([heading, links]) => (
            <div key={heading} className="md:col-span-2">
              <h3 className="font-mono text-[10px] text-[--smoke] tracking-[0.25em] uppercase mb-4">
                {heading}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[--mist] hover:text-[--flare] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Payments */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-mono text-[10px] text-[--smoke] tracking-[0.25em] uppercase mb-4">
              Pago
            </h3>
            <div className="flex flex-wrap gap-2">
              {["PIX", "VISA", "MC", "ELO", "AME"].map((p) => (
                <span
                  key={p}
                  className="font-mono text-[10px] font-bold text-[--mist] px-2 py-1 border border-[--border]"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[--border] mt-14 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-[--smoke] font-mono tracking-wider">
            © {new Date().getFullYear()} VAULT.STORE — Feito no Brasil
          </p>
          <p className="text-[10px] text-[--smoke]/70 font-mono tracking-widest uppercase">
            Pagamentos processados pelo Mercado Pago
          </p>
        </div>
      </div>
    </footer>
  );
}
