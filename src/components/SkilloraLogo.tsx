import React from 'react';

export interface SkilloraLogoProps {
  /**
   * 'full': Ribbon icon + 'Skillora' + 'Turn Skills into Opportunities' tagline
   * 'compact': Ribbon icon + 'Skillora' wordmark
   * 'mark': Ribbon icon only
   */
  variant?: 'full' | 'compact' | 'mark';
  /** Height in pixels (or CSS string like '42px') */
  height?: number | string;
  className?: string;
  idPrefix?: string;
}

export const SkilloraLogo: React.FC<SkilloraLogoProps> = ({
  variant = 'full',
  height = 44,
  className = '',
  idPrefix = 'sk-logo',
}) => {
  const topGradId = `${idPrefix}-topGrad`;
  const bottomGradId = `${idPrefix}-bottomGrad`;
  const foldGradId = `${idPrefix}-foldGrad`;
  const dotGradId = `${idPrefix}-dotGrad`;

  // Numeric height resolution for aspect ratio calculation
  const numHeight = typeof height === 'number' ? height : parseInt(height, 10) || 44;

  if (variant === 'mark') {
    return (
      <svg
        viewBox="0 0 360 360"
        height={height}
        width={numHeight}
        className={`skillora-logo-mark ${className}`}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Skillora Logo Mark"
      >
        <defs>
          <linearGradient id={topGradId} x1="10%" y1="90%" x2="95%" y2="15%">
            <stop offset="0%" stopColor="#00D8FF" />
            <stop offset="35%" stopColor="#00B4FF" />
            <stop offset="70%" stopColor="#0080FF" />
            <stop offset="100%" stopColor="#0055FF" />
          </linearGradient>

          <linearGradient id={bottomGradId} x1="20%" y1="10%" x2="85%" y2="95%">
            <stop offset="0%" stopColor="#0066FF" />
            <stop offset="30%" stopColor="#3B82F6" />
            <stop offset="60%" stopColor="#6366F1" />
            <stop offset="85%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          <linearGradient id={foldGradId} x1="90%" y1="20%" x2="10%" y2="80%">
            <stop offset="0%" stopColor="#003B99" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#0F172A" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#31104B" stopOpacity="0.8" />
          </linearGradient>

          <radialGradient id={dotGradId} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="55%" stopColor="#00A3FF" />
            <stop offset="100%" stopColor="#0070E0" />
          </radialGradient>
        </defs>

        <g transform="translate(4, -15)">
          {/* Base Bottom Loop */}
          <path
            d="M 175 190 
               C 225 210, 275 240, 275 285 
               C 275 330, 235 365, 175 365 
               C 120 365, 75 335, 70 295 
               C 68 280, 84 270, 96 280 
               C 112 295, 140 315, 175 315 
               C 215 315, 225 285, 195 265 
               C 165 245, 125 225, 80 195 
               C 65 185, 68 165, 85 165 
               C 115 165, 145 178, 175 190 
               Z"
            fill={`url(#${bottomGradId})`}
          />

          {/* Inner 3D Crease Shadow */}
          <path
            d="M 175 190 
               C 205 205, 245 230, 260 255 
               C 245 235, 215 215, 175 190 
               Z"
            fill={`url(#${foldGradId})`}
            opacity="0.55"
          />

          {/* Main Dynamic Top Ribbon Loop */}
          <path
            d="M 75 190 
               C 65 130, 105 55, 185 55 
               C 240 55, 275 85, 280 110 
               C 282 120, 270 126, 260 120 
               C 235 105, 210 98, 185 98 
               C 135 98, 115 130, 120 170 
               C 125 200, 160 220, 210 230 
               C 230 234, 240 225, 235 212 
               C 220 185, 180 165, 145 155 
               C 95 140, 78 165, 75 190 
               Z"
            fill={`url(#${topGradId})`}
          />

          {/* Cyan Dot Accent */}
          <circle cx="280" cy="110" r="16" fill={`url(#${dotGradId})`} />
        </g>
      </svg>
    );
  }

  if (variant === 'compact') {
    // Width is roughly 2.3x height for icon + "Skillora"
    const compWidth = Math.round(numHeight * 2.3);
    return (
      <svg
        viewBox="0 0 780 340"
        height={height}
        width={compWidth}
        className={`skillora-logo-compact ${className}`}
        style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Skillora"
      >
        <defs>
          <linearGradient id={topGradId} x1="10%" y1="90%" x2="95%" y2="15%">
            <stop offset="0%" stopColor="#00D8FF" />
            <stop offset="35%" stopColor="#00B4FF" />
            <stop offset="70%" stopColor="#0080FF" />
            <stop offset="100%" stopColor="#0055FF" />
          </linearGradient>

          <linearGradient id={bottomGradId} x1="20%" y1="10%" x2="85%" y2="95%">
            <stop offset="0%" stopColor="#0066FF" />
            <stop offset="30%" stopColor="#3B82F6" />
            <stop offset="60%" stopColor="#6366F1" />
            <stop offset="85%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          <linearGradient id={foldGradId} x1="90%" y1="20%" x2="10%" y2="80%">
            <stop offset="0%" stopColor="#003B99" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#0F172A" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#31104B" stopOpacity="0.8" />
          </linearGradient>

          <radialGradient id={dotGradId} cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#38BDF8" />
            <stop offset="55%" stopColor="#00A3FF" />
            <stop offset="100%" stopColor="#0070E0" />
          </radialGradient>
        </defs>

        {/* Mark */}
        <g transform="translate(20, -10)">
          <path
            d="M 175 190 
               C 225 210, 275 240, 275 285 
               C 275 330, 235 365, 175 365 
               C 120 365, 75 335, 70 295 
               C 68 280, 84 270, 96 280 
               C 112 295, 140 315, 175 315 
               C 215 315, 225 285, 195 265 
               C 165 245, 125 225, 80 195 
               C 65 185, 68 165, 85 165 
               C 115 165, 145 178, 175 190 
               Z"
            fill={`url(#${bottomGradId})`}
          />
          <path
            d="M 175 190 
               C 205 205, 245 230, 260 255 
               C 245 235, 215 215, 175 190 
               Z"
            fill={`url(#${foldGradId})`}
            opacity="0.55"
          />
          <path
            d="M 75 190 
               C 65 130, 105 55, 185 55 
               C 240 55, 275 85, 280 110 
               C 282 120, 270 126, 260 120 
               C 235 105, 210 98, 185 98 
               C 135 98, 115 130, 120 170 
               C 125 200, 160 220, 210 230 
               C 230 234, 240 225, 235 212 
               C 220 185, 180 165, 145 155 
               C 95 140, 78 165, 75 190 
               Z"
            fill={`url(#${topGradId})`}
          />
        </g>

        {/* Wordmark */}
        <g transform="translate(325, 30)">
          <text
            x="0"
            y="200"
            fontFamily="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Inter', 'Segoe UI', system-ui, sans-serif"
            fontSize="155"
            fontWeight="800"
            letterSpacing="-0.035em"
            fill="#0B132B"
          >
            Sk&#305;llora
          </text>
          <circle cx="236" cy="93" r="21" fill={`url(#${dotGradId})`} />
        </g>
      </svg>
    );
  }

  // Full variant: 1080 x 440 (aspect ratio ~2.45:1)
  const fullWidth = Math.round(numHeight * 2.45);

  return (
    <svg
      viewBox="0 0 1080 440"
      height={height}
      width={fullWidth}
      className={`skillora-logo-full ${className}`}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0 }}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Skillora: Turn Skills into Opportunities"
    >
      <defs>
        <linearGradient id={topGradId} x1="10%" y1="90%" x2="95%" y2="15%">
          <stop offset="0%" stopColor="#00D8FF" />
          <stop offset="35%" stopColor="#00B4FF" />
          <stop offset="70%" stopColor="#0080FF" />
          <stop offset="100%" stopColor="#0055FF" />
        </linearGradient>

        <linearGradient id={bottomGradId} x1="20%" y1="10%" x2="85%" y2="95%">
          <stop offset="0%" stopColor="#0066FF" />
          <stop offset="30%" stopColor="#3B82F6" />
          <stop offset="60%" stopColor="#6366F1" />
          <stop offset="85%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>

        <linearGradient id={foldGradId} x1="90%" y1="20%" x2="10%" y2="80%">
          <stop offset="0%" stopColor="#003B99" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#0F172A" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#31104B" stopOpacity="0.8" />
        </linearGradient>

        <radialGradient id={dotGradId} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="55%" stopColor="#00A3FF" />
          <stop offset="100%" stopColor="#0070E0" />
        </radialGradient>
      </defs>

      {/* S-Ribbon Mark */}
      <g id="skillora-mark" transform="translate(35, 45)">
        <path
          d="M 175 190 
             C 225 210, 275 240, 275 285 
             C 275 330, 235 365, 175 365 
             C 120 365, 75 335, 70 295 
             C 68 280, 84 270, 96 280 
             C 112 295, 140 315, 175 315 
             C 215 315, 225 285, 195 265 
             C 165 245, 125 225, 80 195 
             C 65 185, 68 165, 85 165 
             C 115 165, 145 178, 175 190 
             Z"
          fill={`url(#${bottomGradId})`}
        />

        <path
          d="M 175 190 
             C 205 205, 245 230, 260 255 
             C 245 235, 215 215, 175 190 
             Z"
          fill={`url(#${foldGradId})`}
          opacity="0.55"
        />

        <path
          d="M 75 190 
             C 65 130, 105 55, 185 55 
             C 240 55, 275 85, 280 110 
             C 282 120, 270 126, 260 120 
             C 235 105, 210 98, 185 98 
             C 135 98, 115 130, 120 170 
             C 125 200, 160 220, 210 230 
             C 230 234, 240 225, 235 212 
             C 220 185, 180 165, 145 155 
             C 95 140, 78 165, 75 190 
             Z"
          fill={`url(#${topGradId})`}
        />
      </g>

      {/* Typography: Wordmark + Tagline */}
      <g id="skillora-wordmark" transform="translate(370, 40)">
        <text
          x="0"
          y="205"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Inter', 'Montserrat', 'Segoe UI', system-ui, sans-serif"
          fontSize="152"
          fontWeight="800"
          letterSpacing="-0.035em"
          fill="#0B132B"
        >
          Sk&#305;llora
        </text>

        <circle cx="232" cy="98" r="21" fill={`url(#${dotGradId})`} />

        <text
          x="5"
          y="278"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Plus Jakarta Sans', 'Inter', 'Segoe UI', system-ui, sans-serif"
          fontSize="34"
          fontWeight="600"
          letterSpacing="0.105em"
          fill="#475569"
        >
          Turn Skills into Opportunities
        </text>
      </g>
    </svg>
  );
};

export default SkilloraLogo;
