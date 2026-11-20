import { ImageResponse } from "next/og";

export const alt = "WeTask · 不知道做什么时，上 WeTask";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #fdfbf7 0%, #faf8f4 45%, #f4ead9 100%)",
          padding: "72px 80px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -180,
            right: -120,
            width: 620,
            height: 620,
            borderRadius: 999,
            background: "radial-gradient(circle, rgba(226,85,43,0.18), rgba(226,85,43,0))",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 22,
              background: "linear-gradient(145deg, #ff8a5c, #e2552b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 24px rgba(226,85,43,0.35)",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12.5l4.6 4.6L19 6.8"
                stroke="#fff"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 38, fontWeight: 700, color: "#1c1a16", letterSpacing: -1 }}>
              WeTask
            </div>
            <div style={{ fontSize: 20, color: "#8b8377" }}>micro-task check-in</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: "#1c1a16",
              lineHeight: 1.1,
              letterSpacing: -2,
              maxWidth: 900,
            }}
          >
            Don&apos;t know what to do?
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: "#e2552b",
              lineHeight: 1.1,
              letterSpacing: -2,
            }}
          >
            Do one small thing.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {["67 micro-tasks", "6 areas", "5–25 min each"].map((label) => (
            <div
              key={label}
              style={{
                display: "flex",
                padding: "12px 22px",
                borderRadius: 999,
                background: "#ffffff",
                border: "1px solid #e8e1d5",
                fontSize: 22,
                color: "#5f584d",
              }}
            >
              {label}
            </div>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 24, color: "#8b8377" }}>wetask.cc</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
