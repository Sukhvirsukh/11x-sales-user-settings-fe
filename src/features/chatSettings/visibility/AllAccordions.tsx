import LeadCollection from "./fields/LeadCollection";
import LookNFeel from "./fields/LookNFeel";
import Position from "./fields/Position";
import SocialButton from "./fields/SocialButton";
import type { ComponentType } from "react";

interface AccordionTab {
    id: string;
    label: string;
    content: ComponentType;
}

const accordions: AccordionTab[] = [
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

export default accordions;
