import { BsEmojiSmile } from "react-icons/bs";
import { IoSendSharp } from "react-icons/io5";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/react";

const MessageInput = () => {
  return (
    <form>
      <InputGroup>
        <Input w={"full"} placeholder="Tapez un message" />
        <InputRightElement gap={3}>
          <BsEmojiSmile size={20} cursor={"pointer"} />
          <IoSendSharp />
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

export default MessageInput;
