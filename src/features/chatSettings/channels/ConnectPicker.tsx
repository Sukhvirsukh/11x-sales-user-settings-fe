import { useMutation, useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useState } from "react";
import Modal from "@/components/design/Modal";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { queryClient } from "@/lib/queryClient";
import { cn } from "@/lib/utils";
import { channelsQueryKey, finishConnect, getConnectSession } from "./channelsApi";
import { CHANNEL_INFO } from "./channelInfo";

interface ConnectPickerProps {
    sessionId: string;
    onDone: () => void;
}

/** Back from Facebook: choose which number, page or Instagram account this store's agent answers. */
export default function ConnectPicker({ sessionId, onDone }: ConnectPickerProps) {
    const session = useQuery({ queryKey: ["chatSettings", "connectSession", sessionId], queryFn: () => getConnectSession(sessionId), retry: false });
    const options = session.data?.options ?? [];
    const info = session.data ? CHANNEL_INFO[session.data.channel] : null;
    const [chosen, setPicked] = useState<string | null>(null);
    // With one option it's already chosen.
    const picked = chosen ?? (options.length === 1 ? options[0].id : null);

    const finish = useMutation({
        mutationFn: () => finishConnect(sessionId, picked!),
        onSuccess: async (connection) => {
            await queryClient.invalidateQueries({ queryKey: channelsQueryKey });
            const name = CHANNEL_INFO[connection.channel].name;
            if (connection.status === "action_required") toast.add({ type: "error", title: name, description: connection.error ?? "Connected, but it needs your attention." });
            else toast.add({ type: "success", title: `${name} connected`, description: "Your agent now answers messages here." });
            onDone();
        },
    });

    const failed = session.isError ? (session.error as Error).message : session.data?.error;
    const noun = info ? (info.account === "page" ? "Facebook page" : info.account === "account" ? "Instagram account" : "WhatsApp number") : "account";

    return (
        <Modal
            open
            onOpenChange={(open) => { if (!open && !finish.isPending) onDone(); }}
            title={failed ? "Couldn't connect" : `Choose your ${noun}`}
            primaryAction={failed ? undefined : {
                label: finish.isPending ? "Connecting…" : "Connect",
                onClick: () => finish.mutate(),
                disabled: !picked || finish.isPending || session.isLoading,
            }}
            closeAction={{ label: failed ? "Close" : "Cancel", disabled: finish.isPending }}
        >
            {session.isLoading && (
                <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground"><Spinner /> Loading what you shared on Facebook…</div>
            )}
            {failed && <p className="text-sm text-muted-foreground">{failed}</p>}
            {!failed && options.length > 0 && (
                <div className="flex flex-col gap-3">
                    <p className="text-sm text-muted-foreground">Your AI agent will answer messages sent to the {noun} you pick.</p>
                    <div role="radiogroup" aria-label={noun} className="flex flex-col gap-2">
                        {options.map((o) => {
                            const on = picked === o.id;
                            return (
                                <button
                                    key={o.id}
                                    type="button"
                                    role="radio"
                                    aria-checked={on}
                                    onClick={() => setPicked(o.id)}
                                    className={cn(
                                        "flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                                        on ? "border-brand bg-brand-soft/40" : "border-border hover:bg-muted/50",
                                    )}
                                >
                                    {o.picture ? (
                                        <img src={o.picture} alt="" className="size-9 shrink-0 rounded-full object-cover" />
                                    ) : (
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                                            {(o.name[0] ?? "?").toUpperCase()}
                                        </span>
                                    )}
                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-sm font-medium text-foreground">{o.name}</span>
                                        <span className="block truncate text-xs text-muted-foreground">{o.detail}</span>
                                    </span>
                                    <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-full border", on ? "border-brand bg-brand text-white" : "border-border")}>
                                        {on && <Check className="size-3" />}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                    {finish.isError && <p className="text-sm text-destructive">{(finish.error as Error).message}</p>}
                </div>
            )}
        </Modal>
    );
}
