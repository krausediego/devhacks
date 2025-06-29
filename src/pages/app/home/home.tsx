import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { supabase } from "@/supabase/supabase";

const HomePage = () => {
  const navigate = useNavigate();

  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        scopes: "read:user, read:org, repo",
      },
    });
  };

  const getSession = async () => {
    const session = await supabase.auth.getSession();
    const accessToken = session.data.session?.provider_token;

    const res = await fetch(
      `https://api.github.com/repos/Idea-Maker/hiperpix-service/pulls?state=open&review_requested=krausediego`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

    const json = await res.json();

    console.log("RES", json);
  };

  const logout = async () => {
    await supabase.auth.signOut();

    navigate("/");
  };

  return (
    <div>
      <Button onClick={signInWithGithub}>Entrar com github</Button>

      <Button onClick={getSession}>Get Session test</Button>

      <Button onClick={logout}>Sair</Button>
    </div>
  );
};

export { HomePage };
