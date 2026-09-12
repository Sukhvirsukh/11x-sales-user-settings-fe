

export interface KnowledgeBase extends Record<string, unknown> {
    id: string
    name: string,
    url: string,
    status: "active" | "inactive",
    createdAt: string,
    lastRefreshAt: string,
    format: "Link" | "Integration" | "Document",
}

export interface KnowledgeBaseResponse {
    items: KnowledgeBase[],
    page: number,
    pageSize: number
    total: number

}

// {
//     "id": "27b8150c-bf2c-4284-95dd-3bf92d832aa8",
//         "name": "Contact",
//             "url": "https://vitlab-uktkdlen.myshopify.com/pages/contact",
//                 "format": "Link",
//                     "content": null,
//                         "sourceType": "PAGE",
//                             "status": "active",
//                                 "createdAt": "2026-09-12T06:59:11.983Z",
//                                     "lastRefreshAt": "2026-09-12T08:44:18.387Z"
// }
