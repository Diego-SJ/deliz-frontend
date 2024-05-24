import { useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

interface UseSendMessageResult {
  sendMessage: (recipient: string, text: string, imageFile: any) => Promise<void>;
  loading: boolean;
  error: string | null;
}
const version = 'v20.0';
const phoneID = '328088110386727';
const token =
  'EAAOOoIYKzcMBO9cvtZCXgn8900RzXfnhORxPdih1KvW0qQHOaOTBwNtN3ZCn036wRQcNNOUdRS0fB7S3ZBVknEX4mZBFWC0QBGXZBFssLC5s47fNZC6xZAgwuIkUE7mTNCTnR8UbeSnmNZBW204Jt1uGYASRjZBWdTbLAZChCeXSABUomDHcULbzkjXomdVB9pbm5hUXT3Nfd6ZCNomX1eH';

const useWhatsappApi = (): UseSendMessageResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (recipient: string, text: string, imageFile: any) => {
    setLoading(true);
    setError(null);

    try {
      let mediaId: string | null = null;

      if (imageFile) {
        // Step 1: Upload the image
        const formData = new FormData();
        formData.append('file', imageFile as any);
        formData.append('type', 'image/png');
        formData.append('messaging_product', 'whatsapp');

        const uploadResponse = await axios.post(`https://graph.facebook.com/${version}/${phoneID}/media`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
            Connection: 'keep-alive',
            'Accept-Encoding': 'gzip, deflate, br',
          },
        });
        mediaId = uploadResponse?.data?.id;
      }

      // Step 2: Send the message with or without the image
      const messagePayload = {
        messaging_product: 'whatsapp',
        to: `52${recipient}`,
        type: mediaId ? 'image' : 'text',
        ...(mediaId ? { image: { id: mediaId, caption: text } } : { text: { body: text } }),
      };

      await axios.post(`https://graph.facebook.com/v19.0/${phoneID}/messages`, messagePayload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      message.success('Mensaje enviado correctamente');
    } catch (err: any) {
      setError(err.message);
      message.error(error?.toString());
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
};

export default useWhatsappApi;
