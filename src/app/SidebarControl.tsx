import React, { useState } from "react";

const SIDEBAR_MODES = [
  { label: "Expanded", value: "expanded" },
  { label: "Collapsed", value: "collapsed" },
  { label: "Expand on hover", value: "hover" },
];

export type SidebarMode = "expanded" | "collapsed" | "hover";

export default function SidebarControl({
  value = "expanded",
  onChange,
}: {
  value?: SidebarMode;
  onChange?: (mode: SidebarMode) => void;
}) {
  const [mode, setMode] = useState<SidebarMode>(value);

  const handleSelect = (val: SidebarMode) => {
    setMode(val);
    onChange?.(val);
  };

  return (
    <div style={{ minWidth: 160 }}>
      {SIDEBAR_MODES.map((opt) => (
        <label
          key={opt.value}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            cursor: "pointer",
            background: mode === opt.value ? "#f3f3f3" : undefined,
            fontWeight: mode === opt.value ? 600 : 400,
            color: mode === opt.value ? "#222" : "#555",
            borderRadius: 8,
            marginBottom: 2,
            borderLeft: mode === opt.value ? "3px solid #888" : "3px solid transparent",
            transition: "background 0.15s, color 0.15s",
          }}
          onClick={() => handleSelect(opt.value as SidebarMode)}
        >
          <input
            type="radio"
            checked={mode === opt.value}
            readOnly
            style={{ accentColor: "#888", marginRight: 8 }}
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
} 