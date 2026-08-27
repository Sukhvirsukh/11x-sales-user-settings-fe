export interface KnowledgeItem {
  id: string;
  name: string;
  url: string;
  status: "active" | "inactive" | "pending";
  createdDate: string;
  lastRefresh: string;
  format: "Link" | "PDF" | "Text" | "Sitemap" | "Feed";
}
