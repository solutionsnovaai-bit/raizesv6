import React from 'react'
/* ============================================================
   ICONS — clean stroke SVG set, exported to window
   ============================================================ */
const Svg = ({ d, children, w = 24, fill, ...p }) => (
  <svg viewBox="0 0 24 24" fill={fill || "none"} stroke="currentColor" strokeWidth="1.7"
       strokeLinecap="round" strokeLinejoin="round" {...p}>
    {d ? <path d={d} /> : children}
  </svg>
);

const IcUpload   = (p) => <Svg {...p}><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M5 16v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3" /></Svg>;
const IcHistory  = (p) => <Svg {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 4v4h4" /><path d="M12 8v4l3 2" /></Svg>;
const IcSpark    = (p) => <Svg {...p}><path d="M12 3l1.6 4.8L18 9.4l-4.4 1.6L12 16l-1.6-5L6 9.4l4.4-1.6z" /><path d="M19 14l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" /></Svg>;
const IcChart    = (p) => <Svg {...p}><path d="M3 3v18h18" /><rect x="7" y="11" width="3" height="6" rx="1" /><rect x="12" y="7" width="3" height="10" rx="1" /><rect x="17" y="13" width="3" height="4" rx="1" /></Svg>;

const IcDoc      = (p) => <Svg {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13h6M9 17h4" /></Svg>;
const IcMoney    = (p) => <Svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v10M14.5 9.2c-.6-.8-1.6-1.2-2.6-1.2-1.4 0-2.4.8-2.4 1.9 0 2.6 5 1.3 5 3.9 0 1.1-1 2-2.6 2-1.1 0-2.1-.4-2.7-1.2" /></Svg>;
const IcCalendar = (p) => <Svg {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /><path d="M8 14h3" /></Svg>;
const IcBell     = (p) => <Svg {...p}><path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" /><path d="M10.3 20a2 2 0 0 0 3.4 0" /></Svg>;

const IcSend     = (p) => <Svg {...p}><path d="M4 12l16-7-7 16-2.5-6.5z" /><path d="M11 13l9-8" /></Svg>;
const IcDownload = (p) => <Svg {...p}><path d="M12 4v11" /><path d="m8 11 4 4 4-4" /><path d="M5 19h14" /></Svg>;
const IcClose    = (p) => <Svg {...p}><path d="M6 6l12 12M18 6 6 18" /></Svg>;
const IcLogout   = (p) => <Svg {...p}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 12H3m0 0 3.5-3.5M3 12l3.5 3.5" /></Svg>;
const IcCheck    = (p) => <Svg {...p}><path className="check-draw" d="M5 13l4 4 10-11" /></Svg>;
const IcAlert    = (p) => <Svg {...p}><path d="M12 3l9 16H3z" /><path d="M12 10v4M12 17h.01" /></Svg>;
const IcArrowUp  = (p) => <Svg {...p} w={16}><path d="M12 19V6M6 12l6-6 6 6" /></Svg>;
const IcArrowDn  = (p) => <Svg {...p}><path d="M12 5v13M6 12l6 6 6-6" /></Svg>;
const IcScale    = (p) => <Svg {...p}><path d="M12 3v18M7 21h10" /><path d="M5 7h14M8 7l-3 6a3 3 0 0 0 6 0zM16 7l3 6a3 3 0 0 1-6 0z" /></Svg>;
const IcBolt     = (p) => <Svg {...p}><path d="M13 3 4 14h7l-1 7 9-11h-7z" /></Svg>;
const IcDot      = (p) => <Svg {...p} fill="currentColor" stroke="none"><circle cx="12" cy="12" r="5" /></Svg>;
const IcLeaf     = (p) => <Svg {...p}><path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 9-9 4 0 7 1 7 1s-1 3-1 7a7 7 0 0 1-7 7z" /><path d="M11 20c0-4 2-8 6-10" /></Svg>;
const IcMic      = (p) => <Svg {...p}><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0" /><path d="M12 18v3M8 21h8" /></Svg>;

const RZ_ICONS = {
  IcUpload, IcHistory, IcSpark, IcChart, IcDoc, IcMoney, IcCalendar, IcBell,
  IcSend, IcDownload, IcClose, IcLogout, IcCheck, IcAlert, IcArrowUp, IcArrowDn,
  IcScale, IcBolt, IcDot, IcLeaf, IcMic,
};

export default RZ_ICONS;
