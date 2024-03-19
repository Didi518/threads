import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { Flex, Spinner } from "@chakra-ui/react";

import useShowToast from "../hooks/useShowToast";
import useGetUserProfile from "../hooks/useGetUserProfile";
import postsAtom from "../atoms/postsAtom";
import UserHeader from "../components/UserHeader";
import Post from "../components/Post";

const UserPage = () => {
  const [fetchingPosts, setFetchingPosts] = useState(true);
  const { username } = useParams();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { user, loading } = useGetUserProfile();
  const showToast = useShowToast();

  useEffect(() => {
    const getPosts = async () => {
      if (!user) return;
      setFetchingPosts(true);

      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        showToast("Erreur", error.message, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getPosts();
  }, [username, setPosts, showToast, user]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!user && !loading) return <h1>Utilisateur introuvable</h1>;

  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && (
        <h1>Aucun contenu sur ce compte</h1>
      )}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default UserPage;
