import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from '@nextui-org/react';

export default function App() {
  const menuItems = [
    'Profile',
    'Dashboard',
    'Activity',
    'Analytics',
    'System',
    'Deployments',
    'My Settings',
    'Team Settings',
    'Help & Feedback',
    'Log Out',
  ];

  return (
    <Navbar disableAnimation isBordered className='w-full'>
      <NavbarContent className='hidden sm:flex gap-4' justify='center'>
        <NavbarItem>
          <Link color='foreground' href='/'>
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color='foreground' href='/create-wallet'>
            Create
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href='/execute-tx' aria-current='page' color='foreground'>
            Execute
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify='end'>
        <NavbarItem>
          <ConnectButton />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
