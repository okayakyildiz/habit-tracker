"use client";

import dynamic from "next/dynamic";

const App = dynamic(() => import("@/components/App"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F5F2F2",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "3px solid #E8E4E4",
          borderTopColor: "#5A7ACD",
          animation: "spin 0.8s linear infinite",
        }}
      />
    </div>
  ),
});

export default function Page() {
  return <App />;
}
