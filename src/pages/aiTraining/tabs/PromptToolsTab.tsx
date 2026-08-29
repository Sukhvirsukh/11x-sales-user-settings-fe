import { usePromptToolsStore } from "../stores";

export function PromptToolsTab() {
  const {
    humanHelp,
    additionalInstruction,
    tools,
    setHumanHelp,
    setAdditionalInstruction,
    toggleTool,
  } = usePromptToolsStore();

  return (
    <div className="mt-[15px]">
      <div className="w-full rounded-[8px] border border-brand-muted bg-surface-raised shadow-card">
        {/* Set the behaviour */}
        <div className="p-[24px]">
          <h2 className="text-title font-semibold leading-none text-foreground">
            Set the behaviour
          </h2>

          <div className="mt-[20px] flex gap-[24px]">
            {/* Text fields */}
            <div className="flex-1">
              {/* Human help support */}
              <div>
                <label className="text-body font-medium text-foreground">
                  Human help support
                </label>
                <textarea
                  value={humanHelp}
                  onChange={(e) => setHumanHelp(e.target.value)}
                  placeholder="E.g: In order to reach to our team send us an email at support@example.com"
                  className="mt-[8px] h-[60px] w-full resize-none rounded-[8px] border border-border-strong bg-card px-[12px] py-[10px] text-body-sm leading-[18px] text-foreground outline-none placeholder:text-placeholder focus:border-primary focus:shadow-[0_0_0_3px_var(--brand-muted)]"
                />
              </div>

              {/* Additional instruction */}
              <div className="mt-[20px]">
                <label className="text-body font-medium text-foreground">
                  Additional instruction
                </label>
                <textarea
                  value={additionalInstruction}
                  onChange={(e) => setAdditionalInstruction(e.target.value)}
                  className="mt-[8px] h-[80px] w-full resize-none rounded-[8px] border border-border-strong bg-card px-[12px] py-[10px] text-body-sm leading-[18px] text-foreground outline-none placeholder:text-placeholder focus:border-primary focus:shadow-[0_0_0_3px_var(--brand-muted)]"
                />
              </div>
            </div>

            {/* Example sidebar */}
            <div className="w-[200px] shrink-0 rounded-[8px] bg-surface-muted p-[16px]">
              <p className="text-body-sm font-semibold text-foreground">Example:</p>
              <ul className="mt-[8px] flex flex-col gap-[6px] text-caption leading-[16px] text-muted-foreground">
                <li>• Your name is Karl ai</li>
                <li>• You're here to assist the user to know about the product variants</li>
                <li>• Stay on brand related queries</li>
                <li>• Defend the brand loyalty</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-[24px] border-t border-border" />

        {/* Tools to empower */}
        <div className="p-[24px]">
          <h2 className="text-title font-semibold leading-none text-foreground">
            Tools to empower
          </h2>

          <div className="mt-[16px] grid grid-cols-2 gap-[16px]">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-start justify-between rounded-[8px] border border-border bg-card p-[16px]"
              >
                <div className="flex-1 pr-[12px]">
                  <p className="text-body font-medium text-foreground">
                    {tool.name}
                  </p>
                  <p className="mt-[4px] text-caption leading-[16px] text-muted-foreground">
                    {tool.description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-[8px]">
                  <button
                    onClick={() => toggleTool(tool.id)}
                    className={`relative h-[22px] w-[40px] rounded-full transition-colors ${
                      tool.activated ? "bg-success-strong" : "bg-border-strong"
                    }`}
                  >
                    <span
                      className={`absolute top-[3px] h-[16px] w-[16px] rounded-full bg-card shadow transition-transform ${
                        tool.activated ? "left-[21px]" : "left-[3px]"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-caption font-medium ${
                      tool.activated ? "text-success-strong" : "text-muted-foreground"
                    }`}
                  >
                    {tool.activated ? "Activated" : "Not activated"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
