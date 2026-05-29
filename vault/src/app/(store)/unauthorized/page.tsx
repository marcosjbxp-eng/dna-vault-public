import Link from "next/link";
import { Button } from "@/components/ui";
import { ShieldAlert } from "lucide-react";

export const metadata = {
  title: "Acesso Negado | VAULT",
  description: "Você não possui permissão para acessar esta página.",
};

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-12 text-center">
      <div className="w-16 h-16 bg-danger/10 text-danger border border-danger/20 flex items-center justify-center mb-6">
        <ShieldAlert size={32} />
      </div>
      
      <h1 className="text-3xl font-extrabold text-[--white] tracking-tight sm:text-4xl">
        Acesso Restrito
      </h1>
      
      <p className="mt-4 text-sm text-[--smoke] max-w-md leading-relaxed">
        Você não possui privilégios de administrador para acessar esta área. Se você acredita que isso é um erro, por favor autentique-se com uma conta administradora.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link href="/login?callbackUrl=/store">
          <Button variant="secondary" className="w-full sm:w-auto uppercase tracking-wider text-xs">
            Trocar de Conta
          </Button>
        </Link>
        <Link href="/store">
          <Button variant="primary" className="w-full sm:w-auto uppercase tracking-wider text-xs">
            Voltar para a Loja
          </Button>
        </Link>
      </div>
    </div>
  );
}
