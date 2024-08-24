import { APP_ROUTES } from '@/routes/routes';
import { Button, Tooltip } from 'antd';
import { Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AIButton = () => {
  const navigate = useNavigate();
  return (
    <Tooltip title="Asistente IA">
      <Button size="large" onClick={() => navigate(APP_ROUTES.PRIVATE.AI_CHAT.path)}>
        <Sparkles className="w-4 h-4" strokeWidth={2} />
      </Button>
    </Tooltip>
  );
};

export default AIButton;
