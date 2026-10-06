import type { ReactNode } from "react";
import { InstagramLogo, MessengerLogo, WhatsAppLogo } from "./ChannelLogos";
import type { MetaChannel } from "./channelsApi";

/** Names, logos and what each app needs before it can be connected. */
export const CHANNEL_INFO: Record<MetaChannel, { name: string; pitch: string; logo: ReactNode; account: string; requirements: string[] }> = {
    whatsapp: {
        name: "WhatsApp",
        pitch: "Answer customers on your WhatsApp Business number, day and night.",
        logo: <WhatsAppLogo />,
        account: "number",
        requirements: [
            "A phone number that isn't already on the WhatsApp or WhatsApp Business app (delete that account first, or use a new number).",
            "A Facebook account that can manage your business in Meta Business Suite.",
            "Business verification in Meta Business Suite lifts the trial limits on messages.",
        ],
    },
    instagram: {
        name: "Instagram",
        pitch: "Reply to every Instagram DM automatically and turn followers into buyers.",
        logo: <InstagramLogo />,
        account: "account",
        requirements: [
            "A professional Instagram account (Business or Creator). Personal accounts can't be connected.",
            "That account linked to your brand's Facebook page in Meta Business Suite.",
            "In the Instagram app: Settings › Messages and story replies › Message controls › allow access to messages.",
        ],
    },
    messenger: {
        name: "Messenger",
        pitch: "Respond to messages on your Facebook page around the clock.",
        logo: <MessengerLogo />,
        account: "page",
        requirements: [
            "A Facebook page for your business (personal profiles won't work).",
            "Admin access to that page.",
        ],
    },
};
