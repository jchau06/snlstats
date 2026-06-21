import Image from "next/image";

interface CastMemberRowProps {
  name: string;
  slug: string;
  headshot?: string;
  statValue: string | number;
  onClick?: () => void;
  className?: string;
}

export function CastMemberRow({
  name,
  slug,
  headshot,
  statValue,
  onClick,
  className = "",
}: CastMemberRowProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-4 py-3 px-4 rounded-lg hover:bg-[#1a1a1a] transition-colors duration-base ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      {headshot && (
        <img
          src={headshot}
          alt={name}
          className="w-10 h-10 rounded-full object-cover border border-primary flex-shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"%3E%3Crect fill="%23222222" width="40" height="40"/%3E%3C/svg%3E';
          }}
        />
      )}
      <div className="flex-1 min-w-0">
        <p className="font-sans font-semibold text-tertiary truncate">{name}</p>
      </div>
      <p className="font-mono font-bold text-primary whitespace-nowrap">
        {statValue}
      </p>
    </div>
  );
}
