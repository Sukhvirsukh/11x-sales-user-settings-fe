import { Star } from "lucide-react";

interface RatingStarsProps {
    count: number;
}

export function RatingStars({ count }: RatingStarsProps) {
    return (
        <span className="flex shrink-0 items-center gap-0.5" aria-label={`${count} stars`}>
            {Array.from({ length: count }, (_, index) => (
                <Star key={index} className="size-3.5 text-gray" aria-hidden />
            ))}
        </span>
    );
}
