import { lazy } from 'react';
import { User, Briefcase, FolderKanban, TerminalSquare } from 'lucide-react';

export const APPS = {
  about: {
    id: 'about',
    title: 'About Me',
    icon: User,
    component: lazy(() => import('../components/About')),
    defaultSize: { width: 760, height: 620 },
    defaultPosition: { x: 120, y: 90 },
    minSize: { width: 420, height: 360 },
  },
  experience: {
    id: 'experience',
    title: 'Experience',
    icon: Briefcase,
    component: lazy(() => import('../components/Experience')),
    defaultSize: { width: 720, height: 560 },
    defaultPosition: { x: 180, y: 120 },
    minSize: { width: 420, height: 340 },
  },
  projects: {
    id: 'projects',
    title: 'Projects',
    icon: FolderKanban,
    component: lazy(() => import('../components/Projects')),
    defaultSize: { width: 900, height: 640 },
    defaultPosition: { x: 240, y: 70 },
    minSize: { width: 480, height: 400 },
  },
  terminal: {
    id: 'terminal',
    title: 'Terminal',
    icon: TerminalSquare,
    component: lazy(() => import('../components/Terminal')),
    defaultSize: { width: 760, height: 480 },
    defaultPosition: { x: 300, y: 160 },
    minSize: { width: 420, height: 320 },
  },
};

export const APP_LIST = Object.values(APPS);
