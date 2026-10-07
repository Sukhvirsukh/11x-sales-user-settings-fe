// mammoth ships no types; this is the one function the knowledge base uses.
declare module "mammoth" {
    export function extractRawText(input: { arrayBuffer: ArrayBuffer }): Promise<{ value: string; messages: unknown[] }>;
}
