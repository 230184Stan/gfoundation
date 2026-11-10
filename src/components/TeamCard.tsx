import type { TeamMember } from '@/lib/types';

export default function TeamCard({ member }: { member: TeamMember }) {
  return (
    <div className="team-member-card">
      <div className="member-photo-wrap">
        <img
          src={member.photo_url || '/assets/team/placeholder.png'}
          alt={member.name}
          className="member-photo"
          loading="lazy"
        />
      </div>
      <div className="member-info">
        <div className="member-role">{member.role}</div>
        <div className="member-name">{member.name}</div>
      </div>
    </div>
  );
}
