import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Flex, Spinner } from "@chakra-ui/react";

import useShowToast from "../hooks/useShowToast";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Erreur", data.error, "error");
          return;
        }
        setUser(data);
      } catch (error) {
        showToast("Erreur", error, "error");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [username, showToast]);

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
      <UserPost
        likes={1200}
        replies={481}
        postImg="/post1.png"
        postTitle="Parlons de l'actu."
      />
      <UserPost
        likes={451}
        replies={12}
        postImg="/post2.png"
        postTitle="Tuto Mern Stack."
      />
      <UserPost
        likes={321}
        replies={989}
        postImg="/post3.png"
        postTitle="Je kiffe ce gars."
      />
      <UserPost
        likes={212}
        replies={56}
        postTitle="Ceci est mon premier post."
      />
    </>
  );
};

export default UserPage;
