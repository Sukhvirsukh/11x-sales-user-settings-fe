interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div className="flex items-center gap-5 border-b border-[#E5E5EA] px-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`relative pb-3 text-sm font-medium transition-colors cursor-pointer ${
            activeTab === tab.id
              ? "text-[#2563EB]"
              : "text-[#6B6B76] hover:text-[#1A1A1A]"
          }`}
        >
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2563EB] rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
