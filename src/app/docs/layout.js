import "swagger-ui-dist/swagger-ui.css";

export const metadata = { title: "API Docs" };

export default function DocsLayout({ children }) {
  return (
    <div
      style={{
        width: "100vw",
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        maxWidth: "none",
      }}
    >
      {children}
    </div>
  );
}