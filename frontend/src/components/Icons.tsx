import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;

export const IconBack = (p: P) => (<svg {...base} {...p}><path d="M15 4 7 12l8 8" /></svg>);
export const IconChevron = (p: P) => (<svg {...base} {...p}><path d="m9 5 7 7-7 7" /></svg>);
export const IconMap = (p: P) => (<svg {...base} {...p}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" /><path d="M9 4v14M15 6v14" /></svg>);
export const IconEye = (p: P) => (<svg {...base} {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></svg>);
export const IconBulb = (p: P) => (<svg {...base} {...p}><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3Z" /></svg>);
export const IconSpeaker = (p: P) => (<svg {...base} {...p}><path d="M4 9v6h4l5 4V5L8 9H4Z" /><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /></svg>);
export const IconStop = (p: P) => (<svg {...base} {...p}><rect x="6" y="6" width="12" height="12" rx="2" /></svg>);
export const IconChat = (p: P) => (<svg {...base} {...p}><path d="M4 5h16v11H9l-5 4V5Z" /><path d="M8.5 10.5h.01M12 10.5h.01M15.5 10.5h.01" strokeWidth={2.6} /></svg>);
export const IconThumbUp = (p: P) => (<svg {...base} {...p}><path d="M7 11v9H4v-9h3Zm0 0 4-7a2 2 0 0 1 3 2l-1 4h5a2 2 0 0 1 2 2.3l-1.2 6A2 2 0 0 1 16.8 20H7" /></svg>);
export const IconThumbDown = (p: P) => (<svg {...base} {...p}><path d="M17 13V4h3v9h-3Zm0 0-4 7a2 2 0 0 1-3-2l1-4H6a2 2 0 0 1-2-2.3l1.2-6A2 2 0 0 1 7.2 4H17" /></svg>);
export const IconArrowRight = (p: P) => (<svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const IconArrowUp = (p: P) => (<svg {...base} {...p}><path d="M12 19V5M6 11l6-6 6 6" /></svg>);
export const IconExpand = (p: P) => (<svg {...base} {...p}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>);
export const IconCheck = (p: P) => (<svg {...base} {...p}><path d="m5 12 5 5 9-10" /></svg>);
export const IconClose = (p: P) => (<svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>);
