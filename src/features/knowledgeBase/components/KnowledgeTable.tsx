import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { KnowledgeItem } from "../types";

interface KnowledgeTableProps {
  items: KnowledgeItem[];
  selectedIds: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (id: string, checked: boolean) => void;
}

const columns = [
  { key: "name", label: "Name" },
  { key: "status", label: "Status" },
  { key: "createdDate", label: "Created date" },
  { key: "lastRefresh", label: "Last refresh" },
  { key: "format", label: "Format" },
];

export function KnowledgeTable({
  items,
  selectedIds,
  onSelectAll,
  onSelectItem,
}: KnowledgeTableProps) {
  const allSelected = items.length > 0 && selectedIds.length === items.length;

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border bg-muted">
            <th className="w-12 px-4 py-3">
              <Checkbox
                checked={allSelected}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
              />
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-subtle"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.id}
              className="border-b border-border transition-colors hover:bg-muted last:border-b-0"
            >
              <td className="px-4 py-3.5">
                <Checkbox
                  checked={selectedIds.includes(item.id)}
                  onCheckedChange={(checked) => onSelectItem(item.id, !!checked)}
                />
              </td>
              <td className="px-4 py-3.5">
                <span className="text-sm text-foreground">{item.url}</span>
              </td>
              <td className="px-4 py-3.5">                  
                <Badge variant="secondary">Active</Badge>
              </td>
              <td className="px-4 py-3.5">
                <span className="text-sm text-muted-foreground">
                  {item.createdDate}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <span className="text-sm text-muted-foreground">
                  {item.lastRefresh}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <span className="text-sm text-muted-foreground">{item.format}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
