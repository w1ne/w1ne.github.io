export const site = {
  name: 'Andrii Shylenko',
  title: 'Andrii Shylenko - Founder, connected systems, applied AI',
  description:
    'Founder, open-source projects, and practical notes across embedded systems, IoT architecture, applied AI, and productization.',
  url: 'https://shylenko.com',
  email: 'andrii@shylenko.com',
  avatar: '/images/logoAS_blue_white.png',
  nav: [
    { href: '/', label: 'Home' },
    { href: '/projects/', label: 'Projects' },
    { href: '/about/', label: 'About' }
  ],
  socials: [
    { href: 'https://github.com/w1ne', label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/andrewshylenko/', label: 'LinkedIn' },
    { href: 'https://twitter.com/AndriiShylenko', label: 'Twitter' },
    { href: 'mailto:andrii@shylenko.com', label: 'Email' }
  ]
} as const;
