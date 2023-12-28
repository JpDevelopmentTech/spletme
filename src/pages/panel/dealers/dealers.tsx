import Title from "../../../components/title/title";
import Behavior from "./components/behavior";
import HigherPerformance from "./components/higherperformance";
import Income from "./components/income";
import NavBar from "./components/navbar";
import Symphonic from "./components/symphonic";
import Table from "./components/table";

export default function Dealers() {
  return (
    <div>
      <Title title="Distribuidores" subtitle="subtitulo para distribuidores" />
      <NavBar />
      <Table />
      <div className="grid grid-cols-12 gap-6 mt-10">
      <Behavior />
      <Income />
      <HigherPerformance />
      <Symphonic />
      </div>
    </div>
  );
}
