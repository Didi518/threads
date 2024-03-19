import { Button, Text } from "@chakra-ui/react";

import useShowToast from "../hooks/useShowToast";
import useLogout from "../hooks/useLogout";

const SettingsPage = () => {
  const showToast = useShowToast();
  const logout = useLogout();

  const freezeAccount = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir geler votre compte?")) return;

    try {
      const res = await fetch("/api/users/freeze", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      if (data.error) {
        showToast("Erreur", data.error, "error");
        return;
      }
      if (data.success) {
        await logout();
        showToast("Succès", "Votre compte a été gelé", "success");
      }
    } catch (error) {
      showToast("Erreur", error.message, "error");
    }
  };

  return (
    <>
      <Text my={1} fontWeight={"bold"}>
        Gelez Votre Compte
      </Text>
      <Text my={1}>
        Vous pouvez réactiver votre compte à tout moment en le reconnectant.
      </Text>
      <Button size={"sm"} colorScheme="red" onClick={freezeAccount}>
        Geler
      </Button>
    </>
  );
};

export default SettingsPage;
