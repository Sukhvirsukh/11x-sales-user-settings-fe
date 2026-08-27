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
    <div className="overflow-hidden rounded-xl border border-[#E5E5EA]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#EDEDF0] bg-[#FAFAFB]">
            <th className="w-12 px-4 py-3">
              <Checkbox
                checked={allSelected}
                onChange={(checked) => onSelectAll(checked)}
              />
            </th>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#8A8A94]"
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
              className="border-b border-[#EDEDF0] transition-colors hover:bg-[#F9FAFB] last:border-b-0"
            >
              <td className="px-4 py-3.5">
                <Checkbox
                  checked={selectedIds.includes(item.id)}
                  onChange={(checked) => onSelectItem(item.id, checked)}
                />
              </td>
              <td className="px-4 py-3.5">
                <span className="text-sm text-[#1A1A1A]">{item.url}</span>
              </td>
              <td className="px-4 py-3.5">
                <Badge variant="success">Active</Badge>
              </td>
              <td className="px-4 py-3.5">
                <span className="text-sm text-[#6B6B76]">
                  {item.createdDate}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <span className="text-sm text-[#6B6B76]">
                  {item.lastRefresh}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <span className="text-sm text-[#6B6B76]">{item.format}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
