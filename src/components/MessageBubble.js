export default function MessageBubble({ message }) {
  return (
    <div className={`message ${message.role === "user" ? "user" : "ai"}`}>
      <div className="message-content">{message.content}</div>
    </div>
  );
}
