export const ROLE_OPTIONS = [
    { value: "EDITOR", label: "Editor" },
    { value: "MEMBER", label: "Member" },
];

const ROLE_VALUES = new Set(ROLE_OPTIONS.map(({ value }) => value));

export function isValidRole(value: string) {
    return ROLE_VALUES.has(value);
}
