import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, FileText } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useKnowledgeBaseStore } from "../stores";
import { KnowledgeModal } from "@/features/knowledgeBase";

const subTabs = ["All", "Web pages", "PDFs", "Feed items", "Sitemaps", "Text"];

export function KnowledgeBaseTab() {
  const {
    items,
    selectedIds,
    activeSubTab,
    searchQuery,
    setSearchQuery,
    setActiveSubTab,
    selectAll,
    selectItem,
  } = useKnowledgeBaseStore();

  const [modalOpen, setModalOpen] = useState(false);

  const filteredItems = useMemo(() => {
    let result = items;

    if (activeSubTab !== "All") {
      result = result.filter((item) => item.format === activeSubTab);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.url.toLowerCase().includes(query) ||
          item.format.toLowerCase().includes(query) ||
          item.status.toLowerCase().includes(query)
      );
    }

    return result;
  }, [items, activeSubTab, searchQuery]);

  const allSelected = filteredItems.length > 0 && filteredItems.every((item) => selectedIds.includes(item.id));
  return (
    <div className="mt-[15px] w-full min-w-0">
        {/* Sub-tabs */}
        <div className="flex items-center gap-[24px] pl-[4px]">
          {subTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab)}
              className={`pb-[6px] text-[14px] font-medium transition-colors ${
                activeSubTab === tab
                  ? "border-b-2 border-[#111113] text-[#111113]"
                  : "text-[#6d6d76] hover:text-[#111113]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table card */}
        <div className="mt-[15px] w-full overflow-x-auto rounded-[8px] border border-[#eef3ff] bg-[#fbfbff] shadow-[0_11px_24px_rgba(88,122,184,0.14)]">
          {/* Header */}
          <div className="flex h-[62px] items-center justify-between px-[14px]">
            <h2 className="text-[16px] font-normal leading-none text-[#111113]">
              {activeSubTab === "All" ? "All knowledge bank" : activeSubTab}
            </h2>

            <div className="flex items-center gap-[12px]">
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

              <Button
                onClick={() => setModalOpen(true)}
                className="h-[35px] gap-[8px] rounded-[8px] bg-[#2f6df3] px-[16px] text-[14px] font-medium leading-none text-white hover:bg-[#2558c4]"
              >
                Knowledge
                <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-white/20 text-[14px] leading-none">
                  +
                </span>
              </Button>
            </div>
          </div>

          {/* Table or Empty State */}
          {filteredItems.length === 0 ? (
            <div className="flex w-full flex-col items-center justify-center py-[60px]">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#f3f3f4]">
                <FileText className="h-[24px] w-[24px] text-[#a5a5ad]" />
              </div>
              <p className="mt-[12px] text-[14px] font-medium text-[#111113]">
                No items found
              </p>
              <p className="mt-[4px] text-[13px] text-[#6d6d76]">
                {searchQuery
                  ? "Try adjusting your search query"
                  : `No ${activeSubTab.toLowerCase()} added yet`}
              </p>
            </div>
          ) : (
            <table className="mx-[14px] mb-[14px] w-[calc(100%-28px)] table-fixed border-collapse overflow-hidden rounded-[8px]">
              <colgroup>
                <col className="w-[48px]" />
                <col />
                <col className="w-[120px]" />
                <col className="w-[120px]" />
                <col className="w-[120px]" />
                <col className="w-[80px]" />
              </colgroup>
              <thead>
                <tr className="h-[34px] bg-[#f6f6f7] text-left text-[11px] font-normal leading-none text-[#111113]">
                  <th className="rounded-tl-[8px] pl-[19px]">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={(checked) => selectAll(!!checked, filteredItems.map((i) => i.id))}
                    />
                  </th>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Created date</th>
                  <th>Last refresh</th>
                  <th className="rounded-tr-[8px]">Format</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className="h-[41px] bg-[#f3f3f4] text-[14px] font-normal leading-none text-[#111113]"
                  >
                    <td className={`pl-[10px] ${index === filteredItems.length - 1 ? "rounded-bl-[8px]" : ""}`}>
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={(checked) => selectItem(item.id, !!checked)}
                      />
                    </td>
                    <td className="truncate pr-[28px]">{item.url}</td>
                    <td>
                      <span
                        className={`inline-flex h-[28px] min-w-[73px] items-center justify-center gap-[6px] rounded-full px-[10px] text-[12px] font-normal leading-none ${
                          item.status === "Active"
                            ? "bg-[#e2ffd9] text-[#84a982]"
                            : "bg-[#f3f3f4] text-[#a5a5ad]"
                        }`}
                      >
                        {item.status}
                        <span
                          className={`h-[6px] w-[6px] rounded-full ${
                            item.status === "Active" ? "bg-[#12884f]" : "bg-[#a5a5ad]"
                          }`}
                        />
                      </span>
                    </td>
                    <td>{item.createdDate}</td>
                    <td>{item.lastRefresh}</td>
                    <td className={index === filteredItems.length - 1 ? "rounded-br-[8px]" : ""}>
                      {item.format}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      <KnowledgeModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
