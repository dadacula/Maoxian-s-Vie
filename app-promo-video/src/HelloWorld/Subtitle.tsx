import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLOR_1, FONT_FAMILY } from "./constants";

const subtitle: React.CSSProperties = {
  fontFamily: FONT_FAMILY,
  fontSize: 36,
  textAlign: "center",
  position: "absolute",
  bottom: 280,
  width: "100%",
  lineHeight: 1.5,
};

export const Subtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1]);
  return (
    <div style={{ ...subtitle, opacity }}>
      Daily journal entries from your dog's perspective
      <br />
      <span style={{ fontSize: 32, color: COLOR_1, marginTop: 10 }}>
        📸 AI-Powered • 🐕 Playful • 💾 Memorable
      </span>
    </div>
  );
};
