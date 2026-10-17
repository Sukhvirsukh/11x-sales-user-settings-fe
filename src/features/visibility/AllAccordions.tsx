import { SOCIAL_CHANNELS_ENABLED } from "@/config/features";
import type { AccordionTab } from "./visibilityTypes";

import LookNFeel from "./fields/LookNFeel";
import Position from "./fields/Position";
import SocialButton from "./fields/SocialButton";
import LeadCollection from "./fields/LeadCollection";

const allAccordions: AccordionTab[] = [
    {
        id: "look-and-feel",
        label: "Chat look & feel",
        content: LookNFeel,
    },
    {
        id: "position",
        label: "Position",
        content: Position,
    },
    {
        id: "social-button",
        label: "Social button",
        content: SocialButton,
    },
    {
        id: "lead-collection",
        label: "Lead collection",
        content: LeadCollection,
    },
];

// The WhatsApp / Instagram buttons in the chat need the social channels.
export default SOCIAL_CHANNELS_ENABLED ? allAccordions : allAccordions.filter((tab) => tab.id !== "social-button");
