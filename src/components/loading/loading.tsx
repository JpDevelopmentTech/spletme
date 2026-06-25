interface LoadingProps {
  text?: string;
}

const Loading = ({ text = "Cargando" }: LoadingProps) => {
  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#F7F8FA]">
      <style>{`
        @keyframes bar-slide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(400%);  }
        }
        @keyframes dot-pulse {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
          40%            { transform: scale(1);   opacity: 1;   }
        }
        .bar-fill { animation: bar-slide 1.6s ease-in-out infinite; }
        .dot { animation: dot-pulse 1.2s ease-in-out infinite; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
      `}</style>

      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <span
            className="select-none font-semibold tracking-wide text-[#111827]"
            style={{ fontSize: 13 }}
          >
            {text}
          </span>
          <div className="flex items-center gap-1">
            <span className="dot inline-block h-1.5 w-1.5 rounded-full bg-[#F97316]" />
            <span className="dot inline-block h-1.5 w-1.5 rounded-full bg-[#F97316]" />
            <span className="dot inline-block h-1.5 w-1.5 rounded-full bg-[#F97316]" />
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-full bg-[#E5E7EB]"
          style={{ width: 140, height: 3 }}
        >
          <div
            className="bar-fill absolute inset-y-0 left-0 rounded-full bg-[#F97316]"
            style={{ width: "35%" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loading;
