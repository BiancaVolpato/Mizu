import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type MizuIconName = 'droplet' | 'droplets' | 'calendar' | 'cat' | 'user' | 'plus' | 'pencil' | 'trash';

interface Props { name: MizuIconName; size?: number; color?: string; strokeWidth?: number; }

export const MizuIcon = ({ name, size = 24, color = '#242424', strokeWidth = 1.8 }: Props) => {
  const common = { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessibilityElementsHidden importantForAccessibility="no">
      {name === 'droplet' ? <Path {...common} d="M12 2.8S5.5 9.9 5.5 15.1a6.5 6.5 0 0013 0C18.5 9.9 12 2.8 12 2.8z" /> : null}
      {name === 'droplets' ? <><Path {...common} d="M9.2 3.1S4 8.8 4 13a5.2 5.2 0 0010.4 0c0-4.2-5.2-9.9-5.2-9.9z"/><Path {...common} d="M16.2 10.2S20 14.4 20 17.4a3.8 3.8 0 01-6.9 2.2"/></> : null}
      {name === 'calendar' ? <><Rect {...common} x="3" y="5" width="18" height="16" rx="3"/><Path {...common} d="M7 3v4M17 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01"/></> : null}
      {name === 'cat' ? <><Path {...common} d="M5.5 9L5 3.7l4.1 2.4a8 8 0 015.8 0L19 3.7 18.5 9a7.6 7.6 0 011.2 4.2c0 4.5-3.3 7.3-7.7 7.3s-7.7-2.8-7.7-7.3A7.6 7.6 0 015.5 9z"/><Path {...common} d="M8.3 12h.01M15.7 12h.01M10 16c1.3 1.1 2.7 1.1 4 0"/></> : null}
      {name === 'user' ? <><Circle {...common} cx="12" cy="8" r="4"/><Path {...common} d="M4.8 21c.5-4.5 3.1-7 7.2-7s6.7 2.5 7.2 7"/></> : null}
      {name === 'plus' ? <Path {...common} d="M12 5v14M5 12h14"/> : null}
      {name === 'pencil' ? <><Path {...common} d="M14.7 5.3l4 4M4 20l3.4-.8L19.2 7.4a1.8 1.8 0 000-2.6 1.8 1.8 0 00-2.6 0L4.8 16.6 4 20z"/><Path {...common} d="M13.5 6.5l4 4"/></> : null}
      {name === 'trash' ? <><Path {...common} d="M4 7h16M9 3h6l1 4H8l1-4zM6.5 7l.7 14h9.6l.7-14M10 11v6M14 11v6"/></> : null}
    </Svg>
  );
};
