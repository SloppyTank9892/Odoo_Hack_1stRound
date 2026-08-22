import { ImageResponse } from "next/og";

export const alt = "GlobeTrotter — Personalized Travel Planning & Interactive Itinerary Platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#F7F6F2",
          backgroundImage: "radial-gradient(#E7E2D8 2px, transparent 2px)",
          backgroundSize: "32px 32px",
          padding: "60px 80px",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Glow Accents */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: -100,
            width: 400,
            height: 400,
            borderRadius: 9999,
            backgroundColor: "rgba(244, 166, 42, 0.25)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: 9999,
            backgroundColor: "rgba(118, 84, 111, 0.2)",
            filter: "blur(80px)",
          }}
        />

        {/* Central Content Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            border: "2px solid #E7E2D8",
            borderRadius: 36,
            padding: "48px 64px",
            boxShadow: "0 20px 40px rgba(24, 24, 24, 0.06)",
            maxWidth: 1040,
            width: "100%",
            textAlign: "center",
          }}
        >
          {/* Logo & Category Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 20,
                backgroundColor: "#F4A62A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#181818",
                fontSize: 28,
                fontWeight: "bold",
                boxShadow: "0 4px 12px rgba(244, 166, 42, 0.3)",
              }}
            >
              🌍
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: "#181818",
                  letterSpacing: "-0.03em",
                }}
              >
                GlobeTrotter
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#76546F",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Warm Modern Explorer
              </span>
            </div>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 52,
              fontWeight: 800,
              color: "#181818",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
              margin: "0 0 16px 0",
            }}
          >
            Where are you traveling next?
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontSize: 22,
              color: "#6B655E",
              margin: "0 0 32px 0",
              fontWeight: 500,
              maxWidth: 720,
            }}
          >
            Plan the journey. Experience the story. Interactive multi-city itineraries, budget synchronization & visual timelines.
          </p>

          {/* Circuit Route Pill */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              backgroundColor: "#FEF7EC",
              border: "1.5px solid #FCD89C",
              borderRadius: 9999,
              padding: "10px 24px",
              color: "#B86E00",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            <span>Delhi</span>
            <span>→</span>
            <span>Agra</span>
            <span>→</span>
            <span>Jaipur</span>
            <span>→</span>
            <span>Udaipur</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
