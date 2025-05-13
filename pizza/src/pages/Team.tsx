import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
// import { type TeamMember } from '@cs394-vite-nx-template/shared';

interface TeamMember {
  name: string;
  description: string;
  team: string;
  profilePic: string;
}

export default function Team() {
  const teamMembers: TeamMember[] = [
    {
      name: 'Anthony Behery',
      description: 'Computer Science',
      team: 'Green',
      profilePic:
        '/pfp/anthony.jpg',
    },
    {
      name: 'Aanand Patel',
      description: 'Computer Science',
      team: 'Purple',
      profilePic:
        '/pfp/aanand.jpg',
    },
    {
      name: 'Aidan Goodrow',
      description: 'Computer Science',
      team: 'Green',
      profilePic:
        '/pfp/aidan.jpg',
    },
    {
      name: 'Ashwin Baluja',
      description: 'Computer Science',
      team: 'Purple',
      profilePic:
        '/pfp/ashwin.jpg',
    },
    {
      name: 'Ludi Yu',
      description: 'Computer Science',
      team: 'Green',
      profilePic:
        '/pfp/ludi.jpg',
    },
    {
      name: 'David Park',
      description: 'Computer Science',
      team: 'Green',
      profilePic:
        '/pfp/david.jpg',
    },
    {
      name: 'Eric Polanski',
      description: 'Computer Science',
      team: 'Purple',
      profilePic:
        '/pfp/eric.jpg',
    },
    {
      name: 'Joanna Soltys',
      description: 'Computer Science',
      team: 'Green',
      profilePic:
        '/pfp/joanna.jpg',
    },
    {
      name: 'Laura Felix',
      description: 'Computer Science',
      team: 'Purple',
      profilePic:
        '/pfp/laura.jpg',
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
            </CardContent>
          </Card>
        ))}
      ;
    </>
  );
}
