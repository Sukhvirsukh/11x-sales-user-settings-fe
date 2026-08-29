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
              className={`pb-[6px] text-body font-medium transition-colors ${
                activeSubTab === tab
                  ? "border-b-2 border-foreground text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table card */}
        <div className="mt-[15px] w-full overflow-x-auto rounded-[8px] border border-brand-muted bg-surface-raised shadow-card">
          {/* Header */}
          <div className="flex h-[62px] items-center justify-between px-[14px]">
            <h2 className="text-title font-normal leading-none text-foreground">
              {activeSubTab === "All" ? "All knowledge bank" : activeSubTab}
            </h2>

            <div className="flex items-center gap-[12px]">
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

              <Button
                onClick={() => setModalOpen(true)}
                className="h-[35px] gap-[8px] rounded-[8px] bg-primary px-[16px] text-body font-medium leading-none text-primary-foreground hover:bg-primary-hover"
              >
                Knowledge
                <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-primary-foreground/20 text-body leading-none">
                  +
                </span>
              </Button>
            </div>
          </div>

          {/* Table or Empty State */}
          {filteredItems.length === 0 ? (
            <div className="flex w-full flex-col items-center justify-center py-[60px]">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-muted">
                <FileText className="h-[24px] w-[24px] text-placeholder" />
              </div>
              <p className="mt-[12px] text-body font-medium text-foreground">
                No items found
              </p>
              <p className="mt-[4px] text-body-sm text-muted-foreground">
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
                <tr className="h-[34px] bg-surface-muted text-left text-micro font-normal leading-none text-foreground">
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
                    className="h-[41px] bg-muted text-body font-normal leading-none text-foreground"
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
                        className={`inline-flex h-[28px] min-w-[73px] items-center justify-center gap-[6px] rounded-full px-[10px] text-caption font-normal leading-none ${
                          item.status === "Active"
                            ? "bg-success-muted text-success-foreground"
                            : "bg-muted text-placeholder"
                        }`}
                      >
                        {item.status}
                        <span
                          className={`h-[6px] w-[6px] rounded-full ${
                            item.status === "Active" ? "bg-success" : "bg-placeholder"
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
