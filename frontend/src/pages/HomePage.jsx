import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Box, Flex, Spinner } from "@chakra-ui/react";

import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import Post from "../components/Post";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);

      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Erreur", data.error, "error");
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast("Erreur", error.message, "error");
      } finally {
        setLoading(false);
      }
    };

    getFeedPosts();
  }, [setPosts, showToast]);

  return (
    <Flex gap={"10"} alignItems={"flex-start"}>
      <Box flex={70}>
        {!loading && posts.length === 0 && (
          <h1>Abonnez-vous à des comptes pour recevoir leur contenu</h1>
        )}
        {loading && (
          <Flex justifyContent={"center"}>
            <Spinner size={"xl"} />
          </Flex>
        )}
        {posts.map((post) => (
          <Post key={post._id} post={post} postedBy={post.postedBy} />
        ))}
      </Box>
      <Box flex={30} display={{ base: "none", md: "block" }}>
        <SuggestedUsers />
      </Box>
    </Flex>
  );
};

export default HomePage;
