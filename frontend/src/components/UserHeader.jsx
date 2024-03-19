import { Link as RouterLink } from "react-router-dom";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import { useRecoilValue } from "recoil";
import {
  Avatar,
  Box,
  Button,
  Flex,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";

import useShowToast from "../hooks/useShowToast";
import useFollowUnfollow from "../hooks/useFollowUnfollow";
import userAtom from "../atoms/userAtom";

const UserHeader = ({ user }) => {
  const currentUser = useRecoilValue(userAtom);
  const { handleFollowUnfollow, following, updating } = useFollowUnfollow(user);
  const showToast = useShowToast();

  const copyURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      showToast("Succès", "Lien copié", "success");
    });
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user?.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text fontSize={"sm"}>{user?.username}</Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              borderRadius={"full"}
            >
              actus.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user?.profilePic && (
            <Avatar
              name={user?.name}
              src={user?.profilePic}
              size={{ base: "md", md: "xl" }}
            />
          )}
          {!user?.profilePic && (
            <Avatar
              name={user?.name}
              src="https://bit.ly/broken-link"
              size={{ base: "md", md: "xl" }}
            />
          )}
        </Box>
      </Flex>
      <Text>{user?.bio}</Text>
      {currentUser?._id === user?._id && (
        <Link as={RouterLink} to="/profil">
          <Button size={"sm"}>Editer le Profil</Button>
        </Link>
      )}
      {currentUser?._id !== user?._id && (
        <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
          {following ? "Ignorer" : "S'abonner"}
        </Button>
      )}
      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user?.followers.length} abonnés</Text>
          <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"} />
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"} />
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyURL}>
                    Copier lien
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          borderBottom={"1.5px solid white"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> Actus</Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={"1px solid gray"}
          justifyContent={"center"}
          color={"gray.light"}
          pb={3}
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}> Réponses</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
