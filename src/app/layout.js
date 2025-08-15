import "./globals.css";
import "../styles/components.css";

export const metadata = {
  title: "AI Teacher Chat",
  description: "Chat with Hitesh Sir and Piyush Sir",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
