export const site = {
  name: 'Andrii Shylenko',
  title: 'Andrii Shylenko - Practical notes from building connected systems',
  description:
    'Engineering notes and project proof from embedded systems, IoT architecture, firmware validation, and productization.',
  url: 'https://shylenko.com',
  email: 'andrii@shylenko.com',
  avatar: '/images/logoAS_blue_white.png',
  nav: [
    { href: '/', label: 'Home' },
    { href: '/notes/', label: 'Notes' },
    { href: '/projects/', label: 'Projects' },
    { href: '/about/', label: 'About' }
  ],
  socials: [
    { href: 'https://github.com/w1ne', label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/andrewshylenko/', label: 'LinkedIn' },
    { href: 'https://twitter.com/AndriiShylenko', label: 'Twitter' },
    { href: 'mailto:andrii@shylenko.com', label: 'Email' }
  ],
  proofPoints: [
    'Embedded and industrial IoT systems',
    'Firmware architecture and validation',
    'Connected products from prototype to field',
    'Open-source tools and engineering notes'
  ]
} as const;
