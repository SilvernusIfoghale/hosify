"use client";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const navItems = [
  { name: "Properties", href: "/landlord/properties" },
  { name: "Verification", href: "/landlord/verification" },
  { name: "History", href: "/landlord/history" },
  { name: "Review", href: "/landlord/review" },
];

export default function LandlordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // Close sidebar when clicking on a link
  const handleLinkClick = () => {
    setOpen(false);
  };

  // Close sidebar when clicking outside (on mobile)
  const handleBackdropClick = () => {
    setOpen(false);
  };

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open]);

  return (
    <div className="flex min-h-screen">
      {/* Mobile Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={handleBackdropClick}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-48 md:w-60 bg-white shadow-xl border-r-2 border-gray-300 transform transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-3 md:p-4">
          <Link
            href={"/landlord"}
            className="block text-xl font-bold mb-6 text-gray-900 mt-16"
          >
            Landlord Dashboard
          </Link>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block p-3 rounded-lg hover:bg-blue-50 hover:text-blue-700 text-gray-700 font-medium transition-all duration-200"
                onClick={handleLinkClick}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile toggle */}
      <div className="md:hidden fixed top-3 left-2 z-50">
        <Button size="icon" variant="outline" onClick={() => setOpen(!open)}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <main className="flex-1 p-4 md:p-6 md:ml-60">{children}</main>
    </div>
  );
}
