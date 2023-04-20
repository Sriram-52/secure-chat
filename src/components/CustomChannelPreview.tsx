import React from "react";
import {
  ChannelPreviewMessenger,
  ChannelPreviewUIComponentProps,
  StreamMessage,
} from "stream-chat-react";
import { useAuth } from "../context/AuthContext";
import { E2eeManger } from "../utils/e2ee";

export default function CustomChannelPreview(
  props: ChannelPreviewUIComponentProps
) {
  const { user } = useAuth();
  const { channel } = props;
  const [lastMessage, setLastMessage] = React.useState<
    StreamMessage | undefined
  >();
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      if (!channel.state.messages.length) {
        setLoading(false);
        return;
      }
      const cipherMessage =
        channel.state.messages[channel.state.messages.length - 1];
      try {
        const decryptedMessage = await E2eeManger.instance.decryptStreamMessage(
          cipherMessage,
          user!.id
        );
        setLoading(false);
        setLastMessage(decryptedMessage);
      } catch (error) {
        setLoading(false);
        setLastMessage({
          ...cipherMessage,
          text: "Error decrypting message",
        });
      }
    })();
  }, [channel]);

  if (loading) return null;

  return (
    <ChannelPreviewMessenger
      {...props}
      latestMessage={lastMessage?.text ?? "No messages yet"}
    />
  );
}
