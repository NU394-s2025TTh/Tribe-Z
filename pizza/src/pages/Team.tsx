import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type TeamMember } from '@cs394-vite-nx-template/shared/';

export default function Team() {
  const teamMembers: TeamMember[] = [
    {
      name: 'Anthony Behery',
      description: 'Computer Science',
      team: 'Green',
      profilePic: '/pfp/anthony.jpg',
      email: 'anthonybehery2026@u.northwestern.edu',
    },
    {
      name: 'Aanand Patel',
      description: 'Computer Science',
      team: 'Purple',
      profilePic: '/pfp/aanand.jpg',
      email: 'aanandpatel2026@u.northwestern.edu',
    },
    {
      name: 'Aidan Goodrow',
      description: 'Computer Science',
      team: 'Green',
      profilePic: '/pfp/aidan.jpg',
      email: 'aidangoodrow2025@u.northwestern.edu',
    },
    {
      name: 'Ashwin Baluja',
      description: 'Computer Science',
      team: 'Purple',
      profilePic: '/pfp/ashwin.jpg',
      email: 'ashwinbaluja2025@u.northwestern.edu',
    },
    {
      name: 'Ludi Yu',
      description: 'Computer Science',
      team: 'Green',
      profilePic: '/pfp/ludi.jpg',
      email: 'ludiyu2026@u.northwestern.edu',
    },
    {
      name: 'David Park',
      description: 'Computer Science',
      team: 'Green',
      profilePic: '/pfp/david.jpg',
      email: 'davidpark2027@u.northwestern.edu',
    },
    {
      name: 'Eric Polanski',
      description: 'Computer Science',
      team: 'Purple',
      profilePic: '/pfp/eric.jpg',
      email: 'ericpolanski2025@u.northwestern.edu',
    },
    {
      name: 'Joanna Soltys',
      description: 'Computer Science',
      team: 'Green',
      profilePic: '/pfp/joanna.jpg',
      email: 'joannasoltys2026@u.northwestern.edu',
    },
    {
      name: 'Laura Felix',
      description: 'Computer Science',
      team: 'Purple',
      profilePic: '/pfp/laura.jpg',
      email: 'laurafelix2026@u.northwestern.edu',
    },
  ];

  return (
    <>
      {teamMembers
        .sort((a, b) => (a.team === 'Green' && b.team !== 'Green' ? -1 : 1))
        .map((member: TeamMember) => (
          <Card
            key={member.name}
            className={`w-[350px] m-2 flex ${
              member.team === 'Green'
                ? 'bg-green-100'
                : member.team === 'Purple'
                ? 'bg-purple-100'
                : ''
            }`}
          >
            <CardHeader>
              <img
                src={member.profilePic}
                alt="Profile"
                className="rounded-full w-24 h-24 mx-auto"
              />
              <CardTitle>{member.name}</CardTitle>
            </CardHeader>
            <CardContent>
              {member?.description ?? 'no description provided'}
              <p>
                <a
                  href={'mailto:' + member.email}
                  className="text-blue-600 underline"
                >
                  {member.email}
                </a>
              </p>
            </CardContent>
          </Card>
        ))}
    </>
  );
}
