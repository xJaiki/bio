import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Effettua il login
      const { user } = await login(email, password);
      if (!user) throw new Error("Login failed");

      // Recupera il profilo associato all'utente loggato
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("user_id", user.id)
        .single();

      if (error || !profile) {
        throw new Error("Profile not found");
      }

      // Reindirizza alla pagina di modifica del profilo
      navigate(`/${profile.username}/edit`);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-xl mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <input type="email" placeholder="Email" className="w-full p-2 border rounded mb-2"
          value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full p-2 border rounded mb-2"
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
