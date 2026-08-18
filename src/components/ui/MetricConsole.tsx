export interface MetricChannel {
  key: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  /** Lectura de apoyo bajo la cifra. */
  caption?: React.ReactNode;
  /** Color de la cifra. Por defecto, el texto principal. */
  valueColor?: string;
  /** Destaca el canal en naranja: reservado para lo accionable. */
  highlight?: boolean;
  /** Ancho fijo en escritorio, para las cifras largas. */
  width?: number;
}

interface MetricConsoleProps {
  channels: MetricChannel[];
}

/**
 * Consola de métricas: una sola superficie dividida por hairlines, en vez de una
 * fila de tarjetas sueltas. Como mucho un canal va destacado, y siempre es el
 * que se puede accionar.
 */
export function MetricConsole({ channels }: MetricConsoleProps) {
  return (
    <div className="flex flex-col divide-y divide-[#E8E8EC] overflow-hidden rounded-[26px] border border-[#E8E8EC] bg-white shadow-[0_10px_28px_-12px_rgba(255,92,0,0.15)] lg:flex-row lg:divide-x lg:divide-y-0">
      {channels.map((channel) => (
        <div
          key={channel.key}
          style={channel.width ? { flexBasis: channel.width } : undefined}
          className={`flex min-w-0 flex-1 flex-col justify-center gap-2 px-6 py-[22px] ${
            channel.highlight ? "bg-[#FFEADD]" : ""
          } ${channel.width ? "lg:flex-grow-0 lg:flex-shrink-0" : ""}`}
        >
          <div className="flex items-center gap-1.5">
            {channel.icon}
            <span
              className={`font-mono text-[9.5px] font-medium tracking-[1.3px] ${
                channel.highlight ? "text-[#FF5C00]" : "text-[#71757E]"
              }`}
            >
              {channel.label}
            </span>
          </div>

          <p
            className="truncate font-mono text-[26px] font-semibold leading-none tracking-tight"
            style={{
              color: channel.valueColor ?? (channel.highlight ? "#FF5C00" : "#1C1D22"),
            }}
          >
            {channel.value}
          </p>

          {channel.caption && (
            <div
              className={`text-[10.5px] ${
                channel.highlight ? "font-semibold text-[#EA580C]" : "text-[#A6AAB2]"
              }`}
            >
              {channel.caption}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
