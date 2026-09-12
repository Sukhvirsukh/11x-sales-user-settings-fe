import AppCard from "@/components/design/AppCard";
import AppSection from "@/components/design/AppSectoin";
import { Badge } from "@/components/ui/badge";
import { Download, MessagesSquare, Sparkles } from "lucide-react";

export default function SystemStatus() {
    return (
        <AppCard
            header="System status"
            headingSize="lg"
            shadow={true}
        >
            <AppSection className="h-auto">
                <div className="w-full">
                    <div className="border-b border-border flex items-center justify-between w-full py-1.5">
                        <p className="block text-sm font-semibold">Agent Name</p>
                        <p className="block text-sm font-semibold">Ations</p>
                    </div>
                    <div className="py-2">
                        <div className="flex items-center justify-between">
                            <div className="flex gap-2">
                                <MessagesSquare size={16} />
                                <span>AI replies</span>
                            </div>
                            <Badge variant="darkSuccess">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between mt-2.5">
                            <div className="flex gap-2">
                                <Sparkles size={16} />
                                <span>AI knowledge</span>
                            </div>
                            <Badge variant="darkSecondary">Learning</Badge>
                        </div>
                        <div className="flex items-center justify-between mt-2.5">
                            <div className="flex gap-2">
                                <Download size={16} />
                                <span>AI replies</span>
                            </div>
                            <Badge variant="darkOutline">Not installed</Badge>
                        </div>
                    </div>
                </div>
            </AppSection>
        </AppCard>
    )
}
