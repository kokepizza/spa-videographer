import "./Nav.css";

type Props = {
  currentView: "home" | "grid";
  isAboutOpen: boolean;
  setView: (view: "home" | "grid") => void;
  toggleAbout: () => void;
};

export default function Nav({
  currentView,
  isAboutOpen,
  setView,
  toggleAbout,
}: Props) {
  return (
    <nav className="nav">
      
      <button
        onClick={() => setView("home")}
        className={`nav-button ${!isAboutOpen && currentView === "home" ? "active" : ""}`}
      >
          <span className="bracket">[ </span>
          <p>home</p>
          <span className="bracket"> ]</span>
      </button>

      <button
        onClick={() => setView("grid")}
        className={`nav-button ${!isAboutOpen && currentView === "grid" ? "active" : ""}`}
      >
        <span className="bracket">[ </span>
        <p>grid</p>
        <span className="bracket"> ]</span>
      </button>

      <button
        onClick={toggleAbout}
        className={`nav-button ${isAboutOpen ? "active" : ""}`}
      >
        <span className="bracket">[ </span>
        <p>info</p>
        <span className="bracket"> ]</span>
      </button>

    </nav>
  );
}