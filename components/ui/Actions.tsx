"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TableAction {
  id: string;
  label: string;
}

interface ActionsProps {
  actionList: TableAction[];
  onAction: (actionId: string) => void;
  className?: string;
}

export function Actions({ actionList, onAction, className }: ActionsProps) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!actionList.length) {
    return null;
  }

  if (actionList.length === 1) {
    const single = actionList[0];
    return (
      <div className={cn("inline-block text-right", className)}>
        <button
          type="button"
          onClick={() => onAction(single.id)}
          className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
        >
          {single.label}
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("relative inline-block text-right", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Actions"
      >
        Actions
        <svg
          className="-mr-1 ml-1 h-4 w-4 shrink-0"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0L5.21 8.23a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {open && (
        <div
          className="absolute right-0 z-10 mt-1 min-w-[120px] origin-top-right rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 dark:ring-white/10 focus:outline-none"
          role="menu"
        >
          <div className="py-1">
            {actionList.map((action) => (
              <button
                key={action.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  onAction(action.id);
                  setOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
