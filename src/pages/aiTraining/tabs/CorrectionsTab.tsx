import { Search, SlidersHorizontal } from "lucide-react";
import { useCorrectionsStore } from "../stores";

export function CorrectionsTab() {
  const { rows, searchQuery, setSearchQuery } = useCorrectionsStore();

  return (
    <div className="mt-[15px] w-full overflow-x-auto rounded-[8px] border border-brand-muted bg-surface-raised shadow-card">
      <div className="flex h-[62px] items-center justify-between px-[14px]">
        <h2 className="text-title font-normal leading-none text-foreground">
          Questions bank
        </h2>

        <label className="flex h-[35px] w-[191px] items-center rounded-[8px] border border-border-strong bg-card px-[11px]">
          <Search className="h-[15px] w-[15px] shrink-0 text-placeholder" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search"
            className="ml-[10px] min-w-0 flex-1 bg-transparent text-body leading-none text-foreground outline-none placeholder:text-placeholder"
          />
          <SlidersHorizontal className="h-[12px] w-[12px] shrink-0 text-placeholder" />
        </label>
      </div>

      <table className="mx-[14px] mb-[14px] w-[calc(100%-28px)] table-fixed border-collapse overflow-hidden rounded-[8px]">
        <colgroup>
          <col className="w-[306px]" />
          <col />
          <col className="w-[168px]" />
          <col className="w-[127px]" />
          <col className="w-[95px]" />
        </colgroup>
        <thead>
          <tr className="h-[34px] bg-surface-muted text-left text-micro font-normal leading-none text-foreground">
            <th className="rounded-tl-[8px] pl-[19px]">Questions</th>
            <th>Corrections</th>
            <th>Created date</th>
            <th>Expire</th>
            <th className="rounded-tr-[8px]">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={row.id}
              className="h-[41px] bg-muted text-body font-normal leading-none text-foreground"
            >
              <td className={`pl-[10px] ${index === rows.length - 1 ? "rounded-bl-[8px]" : ""}`}>
                {row.question}
              </td>
              <td className="truncate pr-[28px]">{row.correction}</td>
              <td>{row.createdDate}</td>
              <td>{row.expire}</td>
              <td className={index === rows.length - 1 ? "rounded-br-[8px]" : ""}>
                <span className="inline-flex h-[28px] min-w-[73px] items-center justify-center gap-[9px] rounded-full bg-success-muted px-[10px] text-caption font-normal leading-none text-success-foreground">
                  {row.status}
                  <span className="h-[6px] w-[6px] rounded-full bg-success" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
