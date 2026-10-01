import AppCard from "@/components/design/AppCard";
import Heading from "@/components/design/Heading";
import AddAgent from "./AddAgent";
import TrainAgent from "./TrainAgent";
import TestAgent from "./TestAgent";
import OnBoardingProgress from "./OnBoardingProgress";

export default function OnBoarding() {

    return (
        <div className="relative z-10 flex min-h-dvh w-full flex-col items-center justify-center p-4">
            <div className="flex flex-col items-center gap-1.5">
                <div className="flex items-center justify-center gap-2">
                    <img
                        src="/logo.svg"
                        alt=""
                        className="size-7 object-contain"
                    />
                    <p className="font-medium">Vitlab</p>
                </div>
                <Heading size="3xl" responsive>
                    Hey! Lets start now
                </Heading>
                <p>
                    Sign in to manage your AI agents, databases, and workspace.
                </p>
            </div>
            <div className="mt-6 w-full max-w-190">
                <AppCard
                    className="md:py-7.5 md:px-5 relative"
                >
                    <OnBoardingProgress />
                    <div className="flex flex-col gap-2.5">
                        <AddAgent />
                        <TrainAgent />
                        <TestAgent />
                    </div>
                </AppCard>
            </div>
        </div>
    )
}
