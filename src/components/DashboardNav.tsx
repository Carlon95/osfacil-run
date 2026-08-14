"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Resumo" },
  { href: "/dashboard/os", label: "Ordens de serviço" },
  { href: "/dashboard/clientes", label: "Clientes" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="mx-auto flex max-w-5xl flex-wrap gap-1 px-5 pb-2">
      {NAV_ITEMS.map((item) => {
        const isActive =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              isActive
                ? "bg-ink text-paper"
                : "text-ink-soft hover:bg-paper-dim hover:text-ink"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
