import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[--border] bg-[--surface]/50 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[--flare] rounded-lg flex items-center justify-center">
                <span className="text-[#0A0C10] font-extrabold text-sm">V</span>
              </div>
              <span className="text-[--white] font-extrabold text-xl tracking-tight">
                VAULT
              </span>
            </div>
            <p className="text-sm text-[--smoke] max-w-sm leading-relaxed">
              Sua plataforma premium de jogos digitais. Keys instantâneas,
              preços imbatíveis, entrega imediata.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-bold text-[--white] mb-4 uppercase tracking-wider">
              Navegar
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-[--smoke] hover:text-[--ice] transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/store"
                  className="text-sm text-[--smoke] hover:text-[--ice] transition-colors"
                >
                  Loja
                </Link>
              </li>
              <li>
                <Link
                  href="/library"
                  className="text-sm text-[--smoke] hover:text-[--ice] transition-colors"
                >
                  Minha Biblioteca
                </Link>
              </li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h3 className="text-sm font-bold text-[--white] mb-4 uppercase tracking-wider">
              Suporte
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-sm text-[--smoke]">FAQ</span>
              </li>
              <li>
                <span className="text-sm text-[--smoke]">Contato</span>
              </li>
              <li>
                <span className="text-sm text-[--smoke]">Termos de Uso</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[--border] mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[--smoke]">
            &copy; {new Date().getFullYear()} VAULT Game Store. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-[--smoke]/60">Pagamento seguro via</span>
            <span className="text-xs font-mono text-[--flare]">Mercado Pago</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
