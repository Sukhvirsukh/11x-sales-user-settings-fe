import { Search, SlidersHorizontal } from "lucide-react";
import { useCorrectionsStore } from "../stores";

export function CorrectionsTab() {
  const { rows, searchQuery, setSearchQuery } = useCorrectionsStore();

  return (
    <div className="mt-[15px] w-full overflow-x-auto rounded-[8px] border border-[#eef3ff] bg-[#fbfbff] shadow-[0_11px_24px_rgba(88,122,184,0.14)]">
      <div className="flex h-[62px] items-center justify-between px-[14px]">
        <h2 className="text-[16px] font-normal leading-none text-[#111113]">
          Questions bank
        </h2>

        <label className="flex h-[35px] w-[191px] items-center rounded-[8px] border border-[#c7c7cc] bg-white px-[11px]">
          <Search className="h-[15px] w-[15px] shrink-0 text-[#b8b8bf]" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search"
            className="ml-[10px] min-w-0 flex-1 bg-transparent text-[14px] leading-none text-[#1f1f23] outline-none placeholder:text-[#a5a5ad]"
          />
          <SlidersHorizontal className="h-[12px] w-[12px] shrink-0 text-[#a7a7af]" />
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
          <tr className="h-[34px] bg-[#f6f6f7] text-left text-[11px] font-normal leading-none text-[#111113]">
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
              className="h-[41px] bg-[#f3f3f4] text-[14px] font-normal leading-none text-[#111113]"
            >
              <td className={`pl-[10px] ${index === rows.length - 1 ? "rounded-bl-[8px]" : ""}`}>
                {row.question}
              </td>
              <td className="truncate pr-[28px]">{row.correction}</td>
              <td>{row.createdDate}</td>
              <td>{row.expire}</td>
              <td className={index === rows.length - 1 ? "rounded-br-[8px]" : ""}>
                <span className="inline-flex h-[28px] min-w-[73px] items-center justify-center gap-[9px] rounded-full bg-[#e2ffd9] px-[10px] text-[12px] font-normal leading-none text-[#84a982]">
                  {row.status}
                  <span className="h-[6px] w-[6px] rounded-full bg-[#12884f]" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
