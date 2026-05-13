import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" rx="8" className="fill-[#FF0000]" />
            <path d="M10 20L20 10L30 20V30H10V20Z" fill="white" />
            <rect x="18" y="22" width="4" height="8" fill="#FF0000" />
        </svg>
    );
}
