import { Zap, ShieldCheck, MessageCircle, RotateCcw } from "lucide-react";

const ITEMS = [
  {
    icon: Zap,
    title: "Entrega em segundos",
    body: "Sua key chega no e-mail no momento da aprovação do pagamento.",
  },
  {
    icon: ShieldCheck,
    title: "Keys 100% originais",
    body: "Licenciadas por distribuidoras oficiais. Sem regiões bloqueadas.",
  },
  {
    icon: RotateCcw,
    title: "Reembolso garantido",
    body: "Não funcionou? Devolvemos o valor em até 24 horas.",
  },
  {
    icon: MessageCircle,
    title: "Suporte humano",
    body: "Atendimento real por WhatsApp, todos os dias, das 9h às 23h.",
  },
];

export function TrustStrip() {
  return (
    <section className="border-y border-[--border] bg-[--surface]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {ITEMS.map(({ icon: Icon, title, body }, i) => (
          <div
            key={title}
            className={`flex gap-4 px-4 py-3 lg:py-0 ${
              i > 0 ? "border-t sm:border-t-0 sm:border-l border-[--border]/60" : ""
            } ${i === 2 ? "lg:border-l border-[--border]/60" : ""}`}
          >
            <Icon
              size={22}
              className="text-[--flare] shrink-0 mt-0.5"
              strokeWidth={1.75}
            />
            <div>
              <h3 className="text-[--white] font-bold text-sm">{title}</h3>
              <p className="text-xs text-[--smoke] leading-relaxed mt-1">
                {body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
