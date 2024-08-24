import { PersonaOptions } from '@nlux/react';
import AvatarPossify from '@/assets/svg/sparkless.svg';

const assistantAvatar = AvatarPossify;
const userAvatar = 'https://docs.nlkit.com/nlux/images/personas/marissa.png';

export const personas: PersonaOptions = {
  assistant: {
    name: 'Asistente IA de Posiffy',
    avatar: assistantAvatar,
    tagline: '¡Hola! Soy el asistente IA de Posiffy. ¿En qué puedo ayudarte hoy?',
  },
  user: {
    name: `Paleteria D'eliz`,
    avatar: userAvatar,
  },
};
