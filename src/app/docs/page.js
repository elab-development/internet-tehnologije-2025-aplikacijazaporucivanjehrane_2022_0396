"use client";

import { useEffect, useState } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-dist/swagger-ui.css";

export default function DocsPage() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    // spreči horizontal/vertical skrol od ostatka layouta dok je na docs
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    fetch("/api/swagger")
      .then((r) => r.json())
      .then(setSpec)
      .catch(() => setSpec({ error: "Failed to load spec" }));

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div className="swagger-overlay">
      <div className="swagger-inner">
        {!spec ? (
          <div style={{ padding: 16 }}>Loading Swagger...</div>
        ) : (
          <SwaggerUI spec={spec} />
        )}
      </div>
    </div>
  );
}