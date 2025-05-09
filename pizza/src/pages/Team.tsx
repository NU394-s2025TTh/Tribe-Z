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
  email: string;
}

export default function Team() {
  const teamMembers: TeamMember[] = [
    {
      name: 'Anthony Behery',
      description: 'Computer Science',
      team: 'Green',
      profilePic:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS20OKYBdcC0C51-IdLtZ1M-HYYXp6RoUBsbg&s',
      email: 'anthonybehery2026@u.northwestern.edu',
    },
    {
      name: 'Aanand Patel',
      description: 'Computer Science',
      team: 'Purple',
      profilePic:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw5HzYhIi5I522n60QeHeZ-yvlsCVrRJS4ZQ&s',
      email: 'aanandpatel2026@u.northwestern.edu',
    },
    {
      name: 'Aidan Goodrow',
      description: 'Computer Science',
      team: 'Green',
      profilePic:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQAh07BFiBqIWV8qzBO0K6O-Y0_fQLi1m4lw&s',
      email: 'aidangoodrow2025@u.northwestern.edu',
    },
    {
      name: 'Ashwin Baluja',
      description: 'Computer Science',
      team: 'Purple',
      profilePic:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTE2fOcOdNxbWvutFAtpYef0op_Vo7UY2XvtA&s',
      email: 'ashwinbaluja2025@u.northwestern.edu',
    },
    {
      name: 'Ludi Yu',
      description: 'Computer Science',
      team: 'Green',
      profilePic:
        'https://lh3.googleusercontent.com/m_drFBM8k9P5_ipJZbyplJzo0t-J00qED8C8wW4WhVD0C6Zb1kE4rd2Tc6edco9w_376X4M=s85',
      email: 'ludiyu2026@u.northwestern.edu',
    },
    {
      name: 'David Park',
      description: 'Computer Science',
      team: 'Green',
      profilePic:
        'https://lh3.googleusercontent.com/B0naCuKiCxt_ZdiCl4I6yBeCjLmctRLsHnoOPDDBt-bq8kra0nZvhqEt-MGmtdMUUtcbKzU=s85',
      email: 'davidpark2027@u.northwestern.edu',
    },
    {
      name: 'Eric Polanski',
      description: 'Computer Science',
      team: 'Purple',
      profilePic:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD3xjwRZ4-dIiEVOypj2r8MB9173N_VCbFzw&s',
      email: 'ericpolanski2025@u.northwestern.edu',
    },
    {
      name: 'Joanna Soltys',
      description: 'Computer Science',
      team: 'Green',
      profilePic:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREt7Zzh1Ozl7DipwOuXA0g0Kfe3Xw_wYvHnw&s',
      email: 'joannasoltys2026@u.northwestern.edu',
    },
    {
      name: 'Laura Felix',
      description: 'Computer Science',
      team: 'Purple',
      profilePic:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5mp-ERZRc6FyOXcUO9CyYi-ctq1PCut7osw&s',
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
