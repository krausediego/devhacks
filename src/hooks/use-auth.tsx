import * as React from "react";
import { useNavigate } from "react-router";

import { supabase } from "@/supabase/supabase";

const AuthContext = React.createContext({});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("aqui", event);
        if (event === "INITIAL_SESSION" && !session) {
          navigate("/login");
        }

        if (event === "SIGNED_OUT") {
          navigate("/login");
          return;
        }
      },
    );

    return () => listener.subscription.unsubscribe();
  }, [navigate]);

  return <AuthContext.Provider value={{}}>{children}</AuthContext.Provider>;
};

const useAuth = () => React.useContext(AuthContext);

export { useAuth, AuthProvider };
