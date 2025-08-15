export default function TeacherToggle({ currentTeacher, onTeacherSwitch }) {
  return (
    <div className="teacher-toggle">
      <button
        className={`toggle-btn ${currentTeacher === "hitesh" ? "active" : ""}`}
        onClick={() => onTeacherSwitch("hitesh")}
      >
        Hitesh Sir
      </button>
      <button
        className={`toggle-btn ${currentTeacher === "piyush" ? "active" : ""}`}
        onClick={() => onTeacherSwitch("piyush")}
      >
        Piyush Sir
      </button>
    </div>
  );
}
