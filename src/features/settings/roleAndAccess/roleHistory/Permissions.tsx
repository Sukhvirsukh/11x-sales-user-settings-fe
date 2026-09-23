import { Controller, type Control } from "react-hook-form";
import CustomTable, { type Column } from "@/components/design/CustomTable";
import { Checkbox } from "@/components/ui/checkbox";
import type { PermissionAction } from "@/features/auth/permissionSchema";
import { PERMISSION_GROUPS } from "@/features/auth/permissions";
import type { RoleFormValues } from "./roleHistoryType";

type PermissionRow = {
    section: string;
    label: string;
};

type PermissionColumn = {
    key: string;
    label: string;
    /** Actions this column grants together. */
    actions: readonly PermissionAction[];
};

/**
 * The table's columns — `PERMISSION_ACTIONS` grouped for display. `create` and
 * `edit` share one checkbox because being able to create something means being
 * able to edit it; toggling it writes both actions at once.
 */
const PERMISSION_COLUMNS: readonly PermissionColumn[] = [
    { key: "view", label: "View", actions: ["view"] },
    { key: "create", label: "Changes", actions: ["create", "edit"] },
    { key: "delete", label: "Delete", actions: ["delete"] },
];

/** One row per catalog section; every row offers every action. */
const rows: PermissionRow[] = PERMISSION_GROUPS.map(({ section, label }) => ({ section, label }));

/**
 * Tightens the shared table's cell padding without changing `CustomTable`. A
 * plain `[&_td]`/`[&_th]` utility outranks the table's own `px-5 py-2.5`
 * (descendant selector vs. single class), so no `!` or `md:` override is needed.
 */
const compactCells = "[&_th]:px-3 [&_th]:py-2 [&_td]:px-3 [&_td]:py-1.5";

/**
 * The permission matrix: sections down the side, actions across the top. It is
 * driven entirely by `PERMISSION_GROUPS`, so a new section shows up here without
 * any change — and every action can be granted to any role.
 *
 * A single `Controller` owns the whole `permissions` map, so toggling a checkbox
 * rewrites just that section instead of relying on dotted field paths.
 */
export default function Permissions({ control, disabled = false }: {
    control: Control<RoleFormValues>;
    disabled?: boolean;
}) {
    return (
        <Controller
            name="permissions"
            control={control}
            render={({ field }) => {
                const values = field.value;

                function setActions(section: string, actions: readonly PermissionAction[], granted: boolean) {
                    const sectionValues = { ...values[section] };
                    for (const action of actions) sectionValues[action] = granted;
                    // A granted action is meaningless without view, so granting
                    // anything implies it. Unchecking never revokes view here.
                    if (granted) sectionValues.view = true;
                    field.onChange({ ...values, [section]: sectionValues });
                }

                const columns: Column[] = [
                    {
                        key: "label",
                        header: "Name",
                        width: "180px",
                        render: (value) => <span className="">{String(value ?? "")}</span>,
                    },
                    ...PERMISSION_COLUMNS.map((column) => ({
                        key: column.key,
                        header: column.label,
                        align: "center" as const,
                        width: column.actions.length > 1 ? "104px" : "64px",
                        render: (_value: unknown, row: Record<string, unknown>) => {
                            const { section, label } = row as PermissionRow;
                            // A merged column counts as granted when any of its actions is —
                            // basic details, for instance, is editable without being creatable.
                            const granted = column.actions.some(
                                (action) => values[section]?.[action] === true,
                            );

                            return (
                                // `align` only sets `text-align`, which cannot move the
                                // checkbox (it is a `flex` box), so centre it here to match
                                // the column header on desktop.
                                <div className="flex md:justify-center">
                                    <Checkbox
                                        checked={granted}
                                        onCheckedChange={(checked) => setActions(section, column.actions, checked)}
                                        disabled={disabled}
                                        aria-label={`${label}: ${column.label}`}
                                    />
                                </div>
                            );
                        },
                    })),
                ];

                return (
                    <CustomTable
                        title="Permissions"
                        // description="Grant any action to any role. Create and edit are granted together."
                        columns={columns}
                        data={rows}
                        className={compactCells}
                    />
                );
            }}
        />
    );
}
