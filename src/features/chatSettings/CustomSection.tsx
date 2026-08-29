import React from 'react'

interface CustomSectionProps {
    heading: string;
    children: React.ReactNode;
}

export default function CustomSection({ heading, children }: CustomSectionProps) {
    return (
        <section className="w-full space-y-2">
            <h4 className="text-sm font-semibold text-foreground">
                {
                    heading
                }
            </h4>
            {/* Main Container Box */}
            <div className="rounded-lg bg-card p-3 sm:p-4">
                {
                    children
                }
            </div>
        </section>
    )
}
