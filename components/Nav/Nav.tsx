import "./Nav.css";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  isAboutOpen: boolean;
  toggleAbout: () => void;
};

export default function Nav({
  isAboutOpen,
  toggleAbout,
}: Props) {
  const pathname = usePathname();

  return (
    <>
      <nav className="nav">
        <Link href="/" className={`nav-button ${!isAboutOpen && pathname === "/" ? "active" : ""}`}>
          <span className="bracket">[ </span>
          <p>home</p>
          <span className="bracket"> ]</span>
        </Link>

        <Link href="/grid" className={`nav-button ${!isAboutOpen && pathname === "/grid" ? "active" : ""}`}>
          <span className="bracket">[ </span>
          <p>grid</p>
          <span className="bracket"> ]</span>
        </Link>

        <button
          onClick={toggleAbout}
          className={`nav-button ${isAboutOpen ? "active" : ""}`}
        >
          <span className="bracket">[ </span>
          <p>about</p>
          <span className="bracket"> ]</span>
        </button>
      </nav>

      <div className={`about-modal ${isAboutOpen ? 'active' : ''}`} onClick={toggleAbout}>
        <div className="about-content" onClick={(e) => e.stopPropagation()}>
          <p>
            Welcome to my videography world. I am a passionate storyteller through the lens, capturing life's most precious moments with cinematic flair. From intimate weddings to epic adventures, every frame tells a unique narrative. Let me transform your memories into timeless visual poetry.
          </p>
        </div>
      </div>
    </>
  );
}