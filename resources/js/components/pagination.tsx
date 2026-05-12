import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export default function Pagination({ links }: Props) {
    if (links.length <= 3) return null;

    return (
        <div className="flex items-center justify-center gap-1 py-4">
            {links.map((link, i) => {
                const isFirst = i === 0;
                const isLast = i === links.length - 1;

                if (link.url === null) {
                    return (
                        <Button
                            key={i}
                            variant="ghost"
                            size="icon"
                            disabled
                            className="h-8 w-8"
                        >
                            {isFirst ? <ChevronLeft className="h-4 w-4" /> : isLast ? <ChevronRight className="h-4 w-4" /> : link.label}
                        </Button>
                    );
                }

                return (
                    <Button
                        key={i}
                        variant={link.active ? 'default' : 'ghost'}
                        size="icon"
                        asChild
                        className="h-8 w-8"
                    >
                        <Link href={link.url}>
                            {isFirst ? <ChevronLeft className="h-4 w-4" /> : isLast ? <ChevronRight className="h-4 w-4" /> : (
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            )}
                        </Link>
                    </Button>
                );
            })}
        </div>
    );
}
