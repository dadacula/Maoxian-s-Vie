import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLOR_1, COLOR_3, FONT_FAMILY } from "./constants";

const container: React.CSSProperties = {
  position: "absolute",
  bottom: 60,
  left: 0,
  right: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 15,
};

const featureItem: React.CSSProperties = {
  fontFamily: FONT_FAMILY,
  fontSize: 28,
  color: COLOR_3,
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "12px 24px",
  backgroundColor: "rgba(232, 213, 183, 0.3)",
  borderRadius: 20,
  backdropFilter: "blur(10px)",
};

const emoji: React.CSSProperties = {
  fontSize: 32,
};

interface FeatureProps {
  delay: number;
  icon: string;
  text: string;
}

const Feature: React.FC<FeatureProps> = ({ delay, icon, text }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const translateY = interpolate(frame, [delay, delay + 20], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ ...featureItem, opacity, transform: `translateY(${translateY}px)` }}>
      <span style={emoji}>{icon}</span>
      <span>{text}</span>
    </div>
  );
};

export const Features: React.FC = () => {
  return (
    <div style={container}>
      <Feature delay={0} icon="📸" text="Photo Capture & AI Analysis" />
      <Feature delay={10} icon="🤖" text="Personalized Dog Journal Entries" />
      <Feature delay={20} icon="😊" text="Mood Detection & Dynamic Backgrounds" />
    </div>
  );
};
