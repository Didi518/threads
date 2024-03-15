import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Flex, Spinner } from "@chakra-ui/react";

import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import postsAtom from "../atoms/postsAtom";

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
    <>
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
    </>
  );
};

export default HomePage;
