type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary';
};

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
    const base = 
        "inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-medium transition border";

    const styles =
        variant === 'primary'
            ? "bg-black text-white border-black hover:opacity-90"
            : "bg-white text-black border-gray-300 hover:bg-gray-50";
    
    return <button className={`${base} ${styles} ${className}`} {...props} />;
}