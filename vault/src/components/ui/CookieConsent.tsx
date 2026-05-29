"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./Button";
import { ShieldAlert } from "lucide-react";

export function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("vault_cookies_accepted");
    if (!consent) {
      // Pequeno delay para uma entrada mais elegante
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("vault_cookies_accepted", "true");
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 25 }}
          className="fixed bottom-6 right-6 left-6 md:left-auto md:max-w-md z-50 p-5 bg-panel/95 backdrop-blur-md border border-border/80 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          <div className="flex gap-4 items-start">
            <div className="p-2 bg-flare/10 text-flare rounded border border-flare/20 shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white tracking-wide uppercase">
                Cookies & Privacidade
              </h4>
              <p className="text-xs text-smoke leading-relaxed">
                Nós usamos cookies para melhorar sua experiência, lembrar seus dados de login e personalizar o precarregamento de jogos na nossa loja. Ao continuar navegando, você aceita o uso destas tecnologias.
              </p>
              <div className="flex gap-3 pt-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-xs py-1.5 px-3 rounded"
                >
                  Recusar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAccept}
                  className="text-xs py-1.5 px-4 bg-flare hover:bg-flare-dim text-void rounded font-bold"
                >
                  Aceitar Cookies
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
