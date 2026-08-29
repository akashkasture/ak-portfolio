import { lazy } from 'react';
import {
  IconPerson, IconCareer, IconRocket, IconPrompt, IconConstellation, IconPlane,
  IconTopology, IconGear, IconBriefing,
} from '../os/icons';
import { GithubIcon } from '../components/SocialIcons';

/* Nine apps, ordered the way someone reads a portfolio: who → where they've
   worked → what they built → how they build it → prove it → reach them.
   Anything that was only furniture (Files, Notes, Trash, Calendar, Dev
   Toolbox, Chat, Trade, System Monitor) is gone — a dock full of empty
   desk accessories made the whole thing read as a demo.

   Briefing leads, and it's what opens on a fresh desktop: the first
   window a visitor sees should answer who this is, not invite them to
   go hunting through a dock for it. */
export const APPS = {
  briefing: {
    id: 'briefing',
    tint: ['#3f5a7a', '#2c405a'],
    title: 'Briefing',
    icon: IconBriefing,
    component: lazy(() => import('./Briefing')),
    defaultSize: { width: 680, height: 640 },
    defaultPosition: { x: 140, y: 80 },
    minSize: { width: 420, height: 400 },
  },
  about: {
    id: 'about',
    tint: ['#4f46e5', '#4338ca'],
    title: 'About Me',
    icon: IconPerson,
    component: lazy(() => import('../components/About')),
    defaultSize: { width: 760, height: 620 },
    defaultPosition: { x: 120, y: 90 },
    minSize: { width: 420, height: 360 },
  },
  experience: {
    id: 'experience',
    tint: ['#d97706', '#b45309'],
    title: 'Experience',
    icon: IconCareer,
    component: lazy(() => import('../components/Experience')),
    defaultSize: { width: 720, height: 560 },
    defaultPosition: { x: 180, y: 120 },
    minSize: { width: 420, height: 340 },
  },
  projects: {
    id: 'projects',
    tint: ['#0369a1', '#075985'],
    title: 'Projects',
    icon: IconRocket,
    component: lazy(() => import('../components/Projects')),
    defaultSize: { width: 900, height: 640 },
    defaultPosition: { x: 240, y: 70 },
    minSize: { width: 480, height: 400 },
  },
  architecture: {
    id: 'architecture',
    tint: ['#6d28d9', '#5b21b6'],
    title: 'Architecture Lab',
    icon: IconTopology,
    component: lazy(() => import('./ArchitectureLab')),
    defaultSize: { width: 820, height: 520 },
    defaultPosition: { x: 160, y: 100 },
    minSize: { width: 520, height: 400 },
  },
  skills: {
    id: 'skills',
    tint: ['#0f766e', '#115e59'],
    title: 'Skills',
    icon: IconConstellation,
    component: lazy(() => import('../components/SkillsConstellation')),
    defaultSize: { width: 820, height: 600 },
    defaultPosition: { x: 160, y: 80 },
    minSize: { width: 480, height: 400 },
  },
  terminal: {
    id: 'terminal',
    tint: ['#1e293b', '#0f172a'],
    iconColor: '#4ade80',
    title: 'Terminal',
    icon: IconPrompt,
    component: lazy(() => import('../components/Terminal')),
    defaultSize: { width: 760, height: 480 },
    defaultPosition: { x: 300, y: 160 },
    minSize: { width: 420, height: 320 },
  },
  github: {
    id: 'github',
    tint: ['#3d434b', '#24292e'],
    title: 'GitHub',
    icon: GithubIcon,
    component: lazy(() => import('./GitHubApp')),
    defaultSize: { width: 700, height: 580 },
    defaultPosition: { x: 200, y: 90 },
    minSize: { width: 420, height: 400 },
  },
  contact: {
    id: 'contact',
    tint: ['#2563eb', '#1d4ed8'],
    title: 'Contact',
    icon: IconPlane,
    component: lazy(() => import('../components/Contact')),
    defaultSize: { width: 800, height: 620 },
    defaultPosition: { x: 220, y: 100 },
    minSize: { width: 460, height: 420 },
  },
  settings: {
    id: 'settings',
    tint: ['#52525b', '#3f3f46'],
    title: 'Settings',
    icon: IconGear,
    component: lazy(() => import('./Settings')),
    defaultSize: { width: 680, height: 560 },
    defaultPosition: { x: 340, y: 110 },
    minSize: { width: 420, height: 420 },
  },
};

export const APP_LIST = Object.values(APPS);
