import HomeView from "./HomeView";
import GridView from "./GridView";
import "./Main.css";

export default function Main({
  view,
}: {
  view: "home" | "grid";
}) {
  return (
    <main className="main-container">
      {view === "home" && <HomeView />}
      {view === "grid" && <GridView />}
    </main>
  );
}