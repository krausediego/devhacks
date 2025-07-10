import { Button } from "@/components/ui/button";
import { supabase } from "@/supabase/supabase";

const LoginPage = () => {
  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        scopes: "read:user, read:org, repo",
      },
    });
  };

  return (
    <div>
      <Button onClick={signInWithGithub}>Entrar com github</Button>
    </div>
  );
};

export { LoginPage };
