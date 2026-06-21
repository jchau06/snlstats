'use client';
import Image from 'next/image'

interface CastMemberInfo {
  id: string;
  name: string;
  slug: string;
  headshot?: string;
}
 
interface LiveFromNewYorkBadgeProps {
  castMembers: CastMemberInfo[];
  className?: string;
}
 
export function LiveFromNewYorkBadge({
  castMembers,
  className = '',
}: LiveFromNewYorkBadgeProps) {
  if (!castMembers || castMembers.length === 0) {
    return null;
  }
 
  return (
    <div className={`bg-secondary border border-[#2C2C2A] rounded-lg p-6 ${className}`}>
      <p className="stat-label mb-4">LIVE FROM NEW YORK</p>
      <div className="flex flex-wrap gap-3">
        {castMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-2 bg-neutral/20 px-3 py-2 rounded-full border border-primary/30 hover:border-primary transition-colors duration-base"
          >
            {member.headshot && (
              <Image
                src={member.headshot}
                alt={member.name}
                fill
                className="w-8 h-8 rounded-full object-cover border border-primary"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"%3E%3Crect fill="%23222222" width="32" height="32"/%3E%3C/svg%3E';
                }}
              />
            )}
            <span className="font-sans font-semibold text-sm text-tertiary">
              {member.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
