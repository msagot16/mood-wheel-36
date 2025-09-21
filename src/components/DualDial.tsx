import React, { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface DualDialProps {
  onEvaluationChange?: (outer: string, inner: string) => void;
}

export const DualDial = ({ onEvaluationChange }: DualDialProps) => {
  const [outerRotation, setOuterRotation] = useState(0);
  const [innerRotation, setInnerRotation] = useState(0);
  const [isDraggingOuter, setIsDraggingOuter] = useState(false);
  const [isDraggingInner, setIsDraggingInner] = useState(false);
  
  const outerDialRef = useRef<SVGGElement>(null);
  const innerDialRef = useRef<SVGGElement>(null);

  const outerCharacteristics = [
    { name: "relaxing", colorHsl: "142 71% 45%", angle: 0 },
    { name: "exciting", colorHsl: "45 93% 55%", angle: 90 },
    { name: "stressing", colorHsl: "0 84% 55%", angle: 180 },
    { name: "boring", colorHsl: "217 91% 60%", angle: 270 },
  ];
  
  const innerCharacteristics = [
    { name: "active", colorHsl: "35 77% 49%", angle: 0 },
    { name: "pleasant", colorHsl: "88 50% 53%", angle: 90 },
    { name: "passive", colorHsl: "221 83% 53%", angle: 180 },
    { name: "unpleasant", colorHsl: "348 83% 47%", angle: 270 },
  ];

  const handleMouseDown = useCallback((e: React.MouseEvent, isOuter: boolean) => {
    e.preventDefault();
    if (isOuter) {
      setIsDraggingOuter(true);
    } else {
      setIsDraggingInner(true);
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent, isOuter: boolean) => {
    e.preventDefault();
    if (isOuter) {
      setIsDraggingOuter(true);
    } else {
      setIsDraggingInner(true);
    }
  }, []);

  const getCharacteristicAtArrow = useCallback((rotation: number, characteristics: typeof outerCharacteristics) => {
    // The arrow points to the top (270° position) 
    // When dial rotates by 'rotation' degrees, we need to find which characteristic is at 270°
    // Original characteristic positions: 0°, 90°, 180°, 270°
    // After rotation, these become: 0°+rotation, 90°+rotation, 180°+rotation, 270°+rotation
    // We want to find which original position + rotation = 270° (mod 360)
    const targetAngle = 270;
    const originalAngle = (targetAngle - rotation + 360) % 360;
    
    // Find the closest characteristic angle
    let closestIndex = 0;
    let minDistance = Math.abs(originalAngle - characteristics[0].angle);
    
    for (let i = 1; i < characteristics.length; i++) {
      const distance = Math.abs(originalAngle - characteristics[i].angle);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }
    
    return characteristics[closestIndex];
  }, []);

  const updateEvaluation = useCallback(() => {
    const outerChar = getCharacteristicAtArrow(outerRotation, outerCharacteristics);
    const innerChar = getCharacteristicAtArrow(-innerRotation, innerCharacteristics);
    onEvaluationChange?.(outerChar.name, innerChar.name);
  }, [outerRotation, innerRotation, onEvaluationChange, getCharacteristicAtArrow]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingOuter && !isDraggingInner) return;
    
    const rect = outerDialRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    
    if (isDraggingOuter) {
      setOuterRotation(angle);
    } else if (isDraggingInner) {
      setInnerRotation(-angle); // Counter-clockwise
    }
  }, [isDraggingOuter, isDraggingInner]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDraggingOuter && !isDraggingInner) return;
    
    const rect = outerDialRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const touch = e.touches[0];
    if (!touch) return;
    
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI);
    
    if (isDraggingOuter) {
      setOuterRotation(angle);
    } else if (isDraggingInner) {
      setInnerRotation(-angle); // Counter-clockwise
    }
  }, [isDraggingOuter, isDraggingInner]);

  // Update evaluation whenever rotation changes
  React.useEffect(() => {
    updateEvaluation();
  }, [updateEvaluation]);

  // Initial evaluation on mount
  React.useEffect(() => {
    updateEvaluation();
  }, []); // Only run once on mount

  const handleMouseUp = useCallback(() => {
    setIsDraggingOuter(false);
    setIsDraggingInner(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDraggingOuter(false);
    setIsDraggingInner(false);
  }, []);

  // Add global mouse and touch event listeners
  React.useEffect(() => {
    if (isDraggingOuter || isDraggingInner) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDraggingOuter, isDraggingInner, handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  return (
    <div className="flex items-center justify-center p-16">
      <div className="relative">
        <svg width="480" height="480" className="premium-shadow rounded-full bg-card">
          <defs>
            {/* Define curved paths for outer ring text */}
            {outerCharacteristics.map((char, index) => {
              const startAngle = (index * 90) - 30; // Adjust for better text positioning
              const endAngle = startAngle + 60; // Shorter arc for better text fit
              const radius = 150; // Middle of the outer ring
              
              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;
              
              const x1 = 240 + radius * Math.cos(startAngleRad);
              const y1 = 240 + radius * Math.sin(startAngleRad);
              const x2 = 240 + radius * Math.cos(endAngleRad);
              const y2 = 240 + radius * Math.sin(endAngleRad);
              
              return (
                <path
                  key={`outer-text-path-${index}`}
                  id={`outer-text-path-${index}`}
                  d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
                  fill="none"
                />
              );
            })}
            
            {/* Define curved paths for inner ring text */}
            {innerCharacteristics.map((char, index) => {
              const startAngle = (index * 90) - 30; // Adjust for better text positioning
              const endAngle = startAngle + 60; // Longer arc for better text fit
              const radius = 80; // Middle of the inner ring
              
              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;
              
              const x1 = 240 + radius * Math.cos(startAngleRad);
              const y1 = 240 + radius * Math.sin(startAngleRad);
              const x2 = 240 + radius * Math.cos(endAngleRad);
              const y2 = 240 + radius * Math.sin(endAngleRad);
              
              return (
                <path
                  key={`inner-text-path-${index}`}
                  id={`inner-text-path-${index}`}
                  d={`M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`}
                  fill="none"
                />
              );
            })}
          </defs>

          {/* Outer Ring */}
          <g
            ref={outerDialRef}
            style={{ transform: `rotate(${outerRotation}deg)`, transformOrigin: "240px 240px" }}
            className="dial-rotate cursor-pointer"
            onMouseDown={(e) => handleMouseDown(e, true)}
            onTouchStart={(e) => handleTouchStart(e, true)}
          >
            {/* Outer ring segments */}
            {outerCharacteristics.map((char, index) => {
              const startAngle = (index * 90) - 45;
              const endAngle = startAngle + 90;
              const largeArcFlag = 0;
              
              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;
              
              const outerRadius = 180;
              const innerRadius = 120;
              
              const x1 = 240 + outerRadius * Math.cos(startAngleRad);
              const y1 = 240 + outerRadius * Math.sin(startAngleRad);
              const x2 = 240 + outerRadius * Math.cos(endAngleRad);
              const y2 = 240 + outerRadius * Math.sin(endAngleRad);
              
              const x3 = 240 + innerRadius * Math.cos(endAngleRad);
              const y3 = 240 + innerRadius * Math.sin(endAngleRad);
              const x4 = 240 + innerRadius * Math.cos(startAngleRad);
              const y4 = 240 + innerRadius * Math.sin(startAngleRad);
              
              const pathData = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
              
              return (
                <g key={char.name}>
                  <path
                    d={pathData}
                    fill={`hsl(${char.colorHsl} / 0.2)`}
                    stroke={`hsl(${char.colorHsl})`}
                    strokeWidth="4"
                    className="dial-smooth"
                    style={{
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                  
                  {/* Curved text following the arc */}
                  <text
                    fill={`hsl(${char.colorHsl})`}
                    fontSize="15"
                    fontWeight="700"
                    className="luxurious-spacing pointer-events-none"
                    textAnchor="middle"
                  >
                    <textPath 
                      href={`#outer-text-path-${index}`} 
                      startOffset="50%"
                    >
                      {char.name.toUpperCase()}
                    </textPath>
                  </text>
                </g>
              );
            })}
          </g>

          {/* Inner Ring */}
          <g
            ref={innerDialRef}
            style={{ transform: `rotate(${innerRotation}deg)`, transformOrigin: "240px 240px" }}
            className="dial-rotate cursor-pointer"
            onMouseDown={(e) => handleMouseDown(e, false)}
            onTouchStart={(e) => handleTouchStart(e, false)}
          >
            {/* Inner ring segments */}
            {innerCharacteristics.map((char, index) => {
              const startAngle = (index * 90) - 45;
              const endAngle = startAngle + 90;
              const largeArcFlag = 0;
              
              const startAngleRad = (startAngle * Math.PI) / 180;
              const endAngleRad = (endAngle * Math.PI) / 180;
              
              const outerRadius = 110;
              const innerRadius = 50;
              
              const x1 = 240 + outerRadius * Math.cos(startAngleRad);
              const y1 = 240 + outerRadius * Math.sin(startAngleRad);
              const x2 = 240 + outerRadius * Math.cos(endAngleRad);
              const y2 = 240 + outerRadius * Math.sin(endAngleRad);
              
              const x3 = 240 + innerRadius * Math.cos(endAngleRad);
              const y3 = 240 + innerRadius * Math.sin(endAngleRad);
              const x4 = 240 + innerRadius * Math.cos(startAngleRad);
              const y4 = 240 + innerRadius * Math.sin(startAngleRad);
              
              const pathData = `M ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4} Z`;
              
              return (
                <g key={char.name}>
                  <path
                    d={pathData}
                    fill={`hsl(${char.colorHsl} / 0.2)`}
                    stroke={`hsl(${char.colorHsl})`}
                    strokeWidth="4"
                    className="dial-smooth"
                    style={{
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  />
                  
                  {/* Curved text following the arc */}
                  <text
                    fill={`hsl(${char.colorHsl})`}
                    fontSize="11"
                    fontWeight="700"
                    className="luxurious-spacing pointer-events-none"
                    textAnchor="middle"
                  >
                    <textPath 
                      href={`#inner-text-path-${index}`} 
                      startOffset="50%"
                    >
                      {char.name.toUpperCase()}
                    </textPath>
                  </text>
                </g>
              );
            })}
          </g>

          {/* Compass Arrow - Simple minimal design */}
          <g className="pointer-events-none">
            {/* Simple arrow pointing up */}
            <path
              d="M 240 50 L 235 35 L 240 25 L 245 35 Z"
              fill="hsl(var(--foreground))"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
          </g>

          {/* Center circle */}
          <circle
            cx="240"
            cy="240"
            r="45"
            className="fill-card stroke-border stroke-[3px]"
          />
          
          {/* Center indicator */}
          <circle
            cx="240"
            cy="240"
            r="8"
            className="fill-primary"
          />
        </svg>
      </div>
    </div>
  );
};