import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type TeamMember } from '@cs394-vite-nx-template/shared';

export default function Team() {
  const teamMembers: TeamMember[] = [
    { name: 'Anthony Behery' },
    { name: 'Aanand Patel' },
    { name: 'Aidan Goodrow' },
    { name: 'Ashwin Baluja' },
    { name: 'Anthony Behery' },
    { name: 'David Park' },
    { name: 'Eric Polanski' },
    { name: 'Joanna Soltys' },
    { name: 'Laura Felix' },
  ];

  return (
    <>
      {teamMembers.map((member: TeamMember) => (
        <Card className="w-[350px] m-2" key={member.name}>
          <CardHeader>
            <CardTitle>{member.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {member?.description ?? 'no description provided'}
          </CardContent>
        </Card>
      ))}
      ;
    </>
  );
}
