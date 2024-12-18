type ButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  variant: 'primary' | 'secondary' | 'danger' | 'warning';
  children: React.ReactNode;
};

const Button = ({ onClick, disabled, variant, children }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`rounded px-4 py-2 text-white ${
      disabled 
        ? "bg-gray-400 cursor-not-allowed"
        : variant === 'primary' 
        ? "bg-blue-500 hover:bg-blue-600"
        : variant === 'danger'
        ? "bg-red-500 hover:bg-red-600"
        : variant === 'warning'
        ? "bg-yellow-600 hover:bg-yellow-700"
        : "bg-gray-500 hover:bg-gray-600"
    }`}
  >
    {children}
  </button>
);

export default Button; 