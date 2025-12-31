"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { CATEGORY_CONFIG, type Category } from "@/lib/constants";

interface SidebarProps {
  activeCategory?: Category | "all";
  todoCounts?: Record<string, number>;
}

export function Sidebar({ activeCategory = "all", todoCounts = {} }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { id: "all", label: "All Tasks", icon: "📋", count: todoCounts["all"] || 0 },
    { id: "today", label: "Today", icon: "📅", count: todoCounts["today"] || 0 },
    { id: "upcoming", label: "Upcoming", icon: "⏰", count: todoCounts["upcoming"] || 0 },
    { id: "completed", label: "Completed", icon: "✅", count: todoCounts["completed"] || 0 },
  ];

  return (
    <aside className="hidden w-64 border-r border-gray-200 bg-white md:block lg:w-72">
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto px-3 py-6">
          {/* Navigation */}
          <div className="space-y-1">
            <div className="px-3 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Main
            </div>
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={`/todos?view=${item.id}`}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeCategory === item.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <Badge variant="secondary" size="sm">
                    {item.count}
                  </Badge>
                )}
              </Link>
            ))}
          </div>

          {/* Categories */}
          <div className="mt-8">
            <div className="px-3 pb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Categories
            </div>
            <div className="space-y-1">
              {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                <Link
                  key={key}
                  href={`/todos?category=${key}`}
                  className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    activeCategory === key
                      ? `${config.bgColor} ${config.color}`
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{config.icon}</span>
                    <span>{config.label}</span>
                  </div>
                  {todoCounts[key] > 0 && (
                    <Badge variant="secondary" size="sm" className={config.bgColor}>
                      {todoCounts[key]}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="border-t border-gray-200 p-4">
          <div className="rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <h3 className="mb-1 text-sm font-semibold text-gray-900">
              Upgrade to Pro
            </h3>
            <p className="mb-3 text-xs text-gray-600">
              Get unlimited tasks and advanced features
            </p>
            <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-105">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
