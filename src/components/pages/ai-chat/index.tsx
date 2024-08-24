import { AiChat, useAsStreamAdapter } from '@nlux/react';
import '@nlux/themes/nova.css';

import { send } from './send';
import AvatarPossify from '@/assets/svg/sparkless.svg';
import AvatarFallback from '@/assets/logo-color.svg';
import { useAppSelector } from '@/hooks/useStore';
import { Avatar } from 'antd';

export default () => {
  const adapter = useAsStreamAdapter(send, []);
  const { company } = useAppSelector(({ app }) => app);
  return (
    <section className="p-5">
      <div className="max-w-[700px] mx-auto w-full">
        <AiChat
          adapter={adapter}
          className="text-center"
          personaOptions={{
            assistant: {
              name: 'Asistente IA de Posiffy',
              avatar: <Avatar src={AvatarPossify} className="bg-white p-1 border" />,
              tagline: '¡Hola! Soy el asistente IA de Posiffy. ¿En qué puedo ayudarte hoy?',
            },
            user: {
              name: `Paleteria D'eliz`,
              avatar: <Avatar src={company?.logo_url || AvatarFallback} className="bg-white p-1 border" />,
            },
          }}
          displayOptions={{ colorScheme: 'light' }}
        />
      </div>
    </section>
  );
};
