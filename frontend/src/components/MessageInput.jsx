import { useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import { useRecoilValue, useSetRecoilState } from "recoil";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { Box, Input, InputGroup, InputRightElement } from "@chakra-ui/react";

import useShowToast from "../hooks/useShowToast";
import {
  conversationsAtom,
  selectedConversationAtom,
} from "../atoms/messagesAtom";

const MessageInput = ({ setMessages }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [messageText, setMessageText] = useState("");
  const selectedConversation = useRecoilValue(selectedConversationAtom);
  const setConversations = useSetRecoilState(conversationsAtom);
  const showToast = useShowToast();

  const addEmoji = (e) => {
    const sym = e.unified.split("_");
    const codeArray = sym.map((el) => parseInt(el, 16));
    let emoji = String.fromCodePoint(...codeArray);
    setMessageText(messageText + emoji);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText) return;

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          recipientId: selectedConversation.userId,
        }),
      });
      const data = await res.json();
      if (data.error) {
        showToast("Erreur", data.error, "error");
        return;
      }

      setShowPicker(false);
      setMessages((messages) => [...messages, data]);

      setConversations((prevConvs) => {
        const updatedConversations = prevConvs.map((conversation) => {
          if (conversation._id === selectedConversation._id) {
            return {
              ...conversation,
              lastMessage: { text: messageText, sender: data.sender },
            };
          }
          return conversation;
        });
        return updatedConversations;
      });
      setMessageText("");
    } catch (error) {
      showToast("Erreur", error.message, "error");
    }
  };

  return (
    <form onSubmit={handleSendMessage}>
      <InputGroup>
        <Input
          w={"full"}
          placeholder="Tapez un message..."
          onChange={(e) => setMessageText(e.target.value)}
          value={messageText}
        />
        <InputRightElement gap={3} position={"relative"}>
          <BsEmojiSmile
            size={20}
            cursor={"pointer"}
            onClick={() => setShowPicker(!showPicker)}
          />
          {showPicker && (
            <Box position={"absolute"} top={"100%"} right={2}>
              <Picker
                data={data}
                locale={"fr"}
                emojiSize={20}
                emojiButtonSize={28}
                onEmojiSelect={addEmoji}
              />
            </Box>
          )}
          <IoSendSharp onClick={handleSendMessage} cursor={"pointer"} />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;
