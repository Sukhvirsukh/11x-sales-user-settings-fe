import React from 'react'

interface CustomSectionProps {
    heading: string;
    children: React.ReactNode;
}

export default function CustomSection({ heading, children }: CustomSectionProps) {
    return (
        <section className="w-full min-w-0 space-y-2">
            <h4 className="text-body font-semibold text-foreground">
                {heading}
            </h4>
            <div className="min-w-0 rounded-lg bg-card p-3 sm:p-4">
                {children}
            </div>
        </section>
    )
}
