import { OctagonXIcon } from "lucide-react";
import AppCard from "@/components/design/AppCard";
import { Button } from "@/components/ui/button";

export default function ErrorPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
            <AppCard className="w-full max-w-md border border-border text-center">
                <div role="alert" className="flex flex-col items-center gap-4">
                    <OctagonXIcon aria-hidden="true" className="size-10 text-danger" />
                    <h1 className="text-2xl font-semibold text-foreground">
                        Something went wrong
                    </h1>
                    <p className="text-muted-foreground">
                        We couldn’t load this page. Please try again or return to the home page.
                    </p>
                </div>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <Button onClick={() => window.location.reload()}>Try again</Button>
                    <Button variant="secondary" onClick={() => window.location.assign("/")}>
                        Go home
                    </Button>
                </div>
            </AppCard>
        </main>
    );
}
