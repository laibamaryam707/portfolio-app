interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm ${className}`}>
      {children}
    </div>
  );
}
