import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { auth } from "@/lib/auth";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="min-h-screen flex flex-col bg-[--void]">
      <Navbar user={session?.user} />
      <CartDrawer />
      
      {/* Page transitions could be added here later with AnimatePresence */}
      <main className="flex-1 pt-16">
        {children}
      </main>

      <Footer />
    </div>
  );
}
