"use client";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navItems = [
  { name: "My Rentals", href: "/tenant/my-rentals" },
  { name: "Saved Properties", href: "/tenant/saved-properties" },
  { name: "Verification", href: "/tenant/verification" },
  { name: "My Reviews", href: "/tenant/reviews" },
];

export default function TenantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen z-10">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 pt-16 bg-white shadow-lg p-4 transform transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <Link href={"/tenant"} className="block text-xl font-bold mb-6 pt-5">
          Tenant Dashboard
        </Link>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block p-2 rounded hover:bg-gray-100"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Mobile toggle */}
      <div className="md:hidden fixed top-3 left-2 z-50">
        <Button size="icon" variant="outline" onClick={() => setOpen(!open)}>
          <Menu className="h-4 w-4" />
        </Button>
      </div>
      <main className="flex-1 p-6 md:ml-64">{children}</main>
    </div>
  );
}
