
import Title from "../../../components/title/title";
import Behavior from "./components/behavior";
import HigherPerformance from "./components/higherperformance";
import Income from "./components/income";
import Table from "./components/table";

export default function Dealers() {
  return (
    <div className="animate-fade-left">
      <div className="flex justify-between items-center">
        <Title
          title="Distribuidores"
          subtitle="subtitulo para distribuidores"
        />
      
      </div>
      <Table />
      <div className="grid grid-cols-12 gap-6 mt-10">
        <Behavior />
        <Income />
        <HigherPerformance />
      </div>
    </div>
  );
}
