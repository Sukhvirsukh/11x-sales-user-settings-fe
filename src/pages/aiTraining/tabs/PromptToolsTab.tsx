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
      <div className="w-full rounded-[8px] border border-[#eef3ff] bg-[#fbfbff] shadow-[0_11px_24px_rgba(88,122,184,0.14)]">
        {/* Set the behaviour */}
        <div className="p-[24px]">
          <h2 className="text-[16px] font-semibold leading-none text-[#111113]">
            Set the behaviour
          </h2>

          <div className="mt-[20px] flex gap-[24px]">
            {/* Text fields */}
            <div className="flex-1">
              {/* Human help support */}
              <div>
                <label className="text-[14px] font-medium text-[#111113]">
                  Human help support
                </label>
                <textarea
                  value={humanHelp}
                  onChange={(e) => setHumanHelp(e.target.value)}
                  placeholder="E.g: In order to reach to our team send us an email at support@example.com"
                  className="mt-[8px] h-[60px] w-full resize-none rounded-[8px] border border-[#d4d4d8] bg-white px-[12px] py-[10px] text-[13px] leading-[18px] text-[#1f1f23] outline-none placeholder:text-[#a5a5ad] focus:border-[#2563eb] focus:shadow-[0_0_0_3px_#dbeafe]"
                />
              </div>

              {/* Additional instruction */}
              <div className="mt-[20px]">
                <label className="text-[14px] font-medium text-[#111113]">
                  Additional instruction
                </label>
                <textarea
                  value={additionalInstruction}
                  onChange={(e) => setAdditionalInstruction(e.target.value)}
                  className="mt-[8px] h-[80px] w-full resize-none rounded-[8px] border border-[#d4d4d8] bg-white px-[12px] py-[10px] text-[13px] leading-[18px] text-[#1f1f23] outline-none placeholder:text-[#a5a5ad] focus:border-[#2563eb] focus:shadow-[0_0_0_3px_#dbeafe]"
                />
              </div>
            </div>

            {/* Example sidebar */}
            <div className="w-[200px] shrink-0 rounded-[8px] bg-[#f6f6f7] p-[16px]">
              <p className="text-[13px] font-semibold text-[#111113]">Example:</p>
              <ul className="mt-[8px] flex flex-col gap-[6px] text-[12px] leading-[16px] text-[#6d6d76]">
                <li>• Your name is Karl ai</li>
                <li>• You're here to assist the user to know about the product variants</li>
                <li>• Stay on brand related queries</li>
                <li>• Defend the brand loyalty</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-[24px] border-t border-[#e5e5ea]" />

        {/* Tools to empower */}
        <div className="p-[24px]">
          <h2 className="text-[16px] font-semibold leading-none text-[#111113]">
            Tools to empower
          </h2>

          <div className="mt-[16px] grid grid-cols-2 gap-[16px]">
            {tools.map((tool) => (
              <div
                key={tool.id}
                className="flex items-start justify-between rounded-[8px] border border-[#e5e5ea] bg-white p-[16px]"
              >
                <div className="flex-1 pr-[12px]">
                  <p className="text-[14px] font-medium text-[#111113]">
                    {tool.name}
                  </p>
                  <p className="mt-[4px] text-[12px] leading-[16px] text-[#6d6d76]">
                    {tool.description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-[8px]">
                  <button
                    onClick={() => toggleTool(tool.id)}
                    className={`relative h-[22px] w-[40px] rounded-full transition-colors ${
                      tool.activated ? "bg-[#22c55e]" : "bg-[#d4d4d8]"
                    }`}
                  >
                    <span
                      className={`absolute top-[3px] h-[16px] w-[16px] rounded-full bg-white shadow transition-transform ${
                        tool.activated ? "left-[21px]" : "left-[3px]"
                      }`}
                    />
                  </button>
                  <span
                    className={`text-[12px] font-medium ${
                      tool.activated ? "text-[#22c55e]" : "text-[#6d6d76]"
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
