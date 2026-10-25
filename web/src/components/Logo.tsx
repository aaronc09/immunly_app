import { useTheme } from '../context/ThemeContext';

interface LogoProps {
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export default function Logo({ size = 32, showWordmark = true, className }: LogoProps) {
  const { theme } = useTheme();
  // Charcoal/mint + teal, matching --primary and --accent in globals.css
  const isDark = theme === 'dark';
  const dark  = isDark ? '#E6F2EE' : '#2C3531';
  const mid   = isDark ? '#A8C1B9' : '#46534E';
  const light = isDark ? '#3DB5AD' : '#116466';
  const pale  = isDark ? '#123C3B' : '#D1E8E2';
  const wordmarkMain = dark;

  return (
    <span className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Central stem (Fc region) */}
        <path d="M32 44 V30" stroke={mid} strokeWidth="6" strokeLinecap="round" />
        {/* Fab arms */}
        <path d="M32 31 L23 17" stroke={dark} strokeWidth="6" strokeLinecap="round" />
        <path d="M32 31 L41 17" stroke={dark} strokeWidth="6" strokeLinecap="round" />
        {/* Left binding site — two parallel bars, shifted inward ~4u along arm */}
        <path d="M27 19 L22 11" stroke={light} strokeWidth="5" strokeLinecap="round" />
        <path d="M23 21 L18 13" stroke={light} strokeWidth="5" strokeLinecap="round" />
        {/* Right binding site — two parallel bars, shifted inward ~4u along arm */}
        <path d="M37 19 L42 11" stroke={light} strokeWidth="5" strokeLinecap="round" />
        <path d="M41 21 L46 13" stroke={light} strokeWidth="5" strokeLinecap="round" />
        {/* Open book */}
        <path
          d="M10 40 C18 36 26 36 32 40 C38 36 46 36 54 40 L54 52 C46 48 38 48 32 52 C26 48 18 48 10 52 Z"
          fill={pale}
          stroke={dark}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M32 40 V52" stroke={dark} strokeWidth="2.5" strokeLinecap="round" />
      </svg>
      {showWordmark && (
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: size * 0.66, letterSpacing: '-0.01em', color: wordmarkMain }}>
          Immun<span style={{ color: light }}>ly</span>
        </span>
      )}
    </span>
  );
}
