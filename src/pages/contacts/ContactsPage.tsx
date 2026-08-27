import { PageHeader } from "@/components/shared/pageHeader";

export function ContactsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-6">
        <PageHeader title="Contacts" subtitle="Manage your contacts" />
        <p className="mt-4 text-sm text-gray-500">
          Contacts management coming soon.
        </p>
      </div>
    </div>
  );
}
