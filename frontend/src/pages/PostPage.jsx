import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { formatDistanceToNow } from "date-fns";
import fr from "date-fns/locale/fr";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

import useGetUserProfile from "../hooks/useGetUserProfile";
import useShowToast from "../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import Actions from "../components/Actions";
import Comment from "../components/Comment";

const PostPage = () => {
  const navigate = useNavigate();
  const { pid } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { user, loading } = useGetUserProfile();
  const showToast = useShowToast();
  const currentPost = posts[0];
  const locale = fr;

  useEffect(() => {
    const getPost = async () => {
      setPosts([]);

      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Erreur", data.error, "error");
          return;
        }

        setPosts([data]);
      } catch (error) {
        showToast("Erreur", error.message, "error");
      }
    };

    getPost();
  }, [pid, setPosts, showToast]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Êtes-vous certain de vouloir supprimer ce post?"))
        return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Erreur", data.error, "error");
        return;
      }
      showToast("Succès", "Post supprimé", "success");
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Erreur", error.message, "error");
    }
  };

  if (!currentPost) return null;

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name="Mark Zuckerberg" />
          <Flex>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.username}
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={4} />
          </Flex>
        </Flex>
        <Flex gap={4} alignItems={"center"}>
          <Text
            fontSize={"xs"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            Il y a{" "}
            {formatDistanceToNow(new Date(currentPost.createdAt), { locale })}
          </Text>
          {currentUser?._id === user._id && (
            <DeleteIcon
              size={20}
              cursor={"pointer"}
              onClick={handleDeletePost}
            />
          )}
        </Flex>
      </Flex>
      <Text my={3}>{currentPost.text}</Text>
      {currentPost.img && (
        <Box
          borderRadius={6}
          overflow={"hidden"}
          border={"1px solid"}
          borderColor={"gray.light"}
        >
          <Image src={currentPost.img} w={"full"} />
        </Box>
      )}
      <Flex gap={3} my={3}>
        <Actions post={currentPost} />
      </Flex>
      <Divider my={4} />
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>
            Obtenez l&apos;appli pour liker, commenter et poster.
          </Text>
        </Flex>
        <Button>Obtenir</Button>
      </Flex>
      <Divider my={4} />
      {currentPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id ===
            currentPost.replies[currentPost.replies.length - 1]._id
          }
        />
      ))}
    </>
  );
};

export default PostPage;
