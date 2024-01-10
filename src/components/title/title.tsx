export default function Title({title, subtitle}: {title: string, subtitle: string}) {
  return (
    <div className="flex flex-col">
      <span className="text-title font-bold">{title}</span>
      <span className="text-normal">{subtitle}</span>
    </div>
  );
}
