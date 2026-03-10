"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Actions, type TableAction } from "./Actions";
export type { TableAction } from "./Actions";
import "./table.css";

function formatHeading(heading: string): string {
  const parts = heading.replace(/([A-Z])/g, " $1").trim().split(/\s+/);
  return parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase())
    .join(" ") || heading;
}

export interface TableComponentOptions {
  hideIds?: boolean;
  isRowClickable?: boolean;
}

export interface TableComponentProps<T extends object> {
  headings: (keyof T & string)[];
  data: T[] | null;
  idKey: keyof T & string;
  route?: string;
  options?: TableComponentOptions;
  customColumnNames?: Partial<Record<string, string>>;
  columnWidths?: Partial<Record<string, string | number>>;
  actions: TableAction[];
  getActionListHandler: (row: T) => string[];
  onAction: (actionId: string, row: T) => void;
  isLoading?: boolean;
  emptyMessage?: string;
  /** Optional cell render per column key. Return null to use row[heading]. */
  renderCell?: (heading: string, value: unknown, row: T) => React.ReactNode | null;
}

export function TableComponent<T extends object>({
  headings,
  data,
  idKey,
  route,
  options = {},
  customColumnNames = {},
  columnWidths = {},
  actions,
  getActionListHandler,
  onAction,
  isLoading = false,
  emptyMessage = "No records found.",
  renderCell,
}: TableComponentProps<T>) {
  const router = useRouter();
  const { hideIds = false, isRowClickable = Boolean(route) } = options;

  const displayHeadings = hideIds ? headings.filter((h) => h !== idKey) : headings;
  const hasActions = actions.length > 0;

  const handleRowClick = (row: T) => {
    if (!isRowClickable || !route) return;
    const id = row[idKey];
    if (id != null) router.push(`${route}/${String(id)}`);
  };

  if (data === null || isLoading) {
    return (
      <TableContainer>
        <Table>
          <TableHeader>
            <TableRow>
              {displayHeadings.map((h) => (
                <TableHead key={h} style={columnWidths[h] != null ? { minWidth: columnWidths[h] } : undefined}>
                  {customColumnNames[h] ?? formatHeading(h)}
                </TableHead>
              ))}
              {hasActions && (
                <TableHead className="text-right w-[100px]">Actions</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {displayHeadings.map((h) => (
                  <TableCell key={h}>
                    <span className="inline-block h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                  </TableCell>
                ))}
                {hasActions && <TableCell />}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (!data.length) {
    return (
      <TableContainer>
        <div className="data-table-empty text-gray-500 dark:text-gray-400">
          <span className="data-table-empty-text">{emptyMessage}</span>
        </div>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            {displayHeadings.map((h) => (
              <TableHead
                key={h}
                style={columnWidths[h] != null ? { minWidth: columnWidths[h] } : undefined}
              >
                {customColumnNames[h] ?? formatHeading(h)}
              </TableHead>
            ))}
            {hasActions && (
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => {
            const recordId = row[idKey];
            const actionIds = getActionListHandler(row);
            const rowActionList = actions.filter((a) => actionIds.includes(a.id));
            return (
              <TableRow
                key={String(recordId)}
                className={isRowClickable ? "cursor-pointer" : undefined}
                onClick={() => handleRowClick(row)}
              >
                {displayHeadings.map((heading) => {
                  const value = row[heading];
                  const custom = renderCell?.(heading, value, row);
                  return (
                    <TableCell key={heading}>
                      {custom !== undefined && custom !== null ? custom : (value != null ? String(value) : "—")}
                    </TableCell>
                  );
                })}
                {hasActions && (
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <Actions
                      actionList={rowActionList}
                      onAction={(actionId) => onAction(actionId, row)}
                    />
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
