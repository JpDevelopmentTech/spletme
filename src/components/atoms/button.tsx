const buttonStyles = {
    primary: 'bg-primary hover:bg-primary/60 focus:ring-primary/30',
    secondary: 'bg-secondary hover:bg-secondary/60 focus:ring-secondary/30',
    tertiary: 'bg-tertiary hover:bg-tertiary/60 focus:ring-tertiary/30',
    quaternary: 'bg-quaternary hover:bg-quaternary/60 focus:ring-quaternary/30',
    quinary: 'bg-quinary hover:bg-quinary/60 focus:ring-quinary/30',
    senary: 'bg-senary hover:bg-senary/60 focus:ring-senary/30',
    septenary: 'bg-septenary hover:bg-septenary/60 focus:ring-septenary/30',
  };
const Button = ({
  onClick,
  children,
  type,
}: {
  onClick: () => void;
  children: React.ReactNode;
  type: "primary" | "secondary" | "tertiary" | "quaternary" | "quinary" | "senary" | "septenary" ;
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        `font-medium  rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:ring-4 text-white ${buttonStyles[type]}`
      }
    >
      {children}
    </button>
  );
};

export default Button;
