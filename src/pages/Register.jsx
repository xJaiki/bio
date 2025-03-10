import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../services/supabaseClient";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { user } = await register(email, password);
      if (user) setStep(2);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSetNickname = async (e) => {
    e.preventDefault();
    try {
      // Controlla se il nickname è già in uso
      const { data: existingProfile, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", nickname)
        .maybeSingle();

      if (profileError) {
        alert("Database error. Try again.");
        return;
      }

      if (existingProfile) {
        alert("This username is already taken. Try another one.");
        return;
      }

      // ✅ Recupera correttamente l'utente loggato
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) {
        alert("Error retrieving user. Try logging in again.");
        return;
      }
      const user = userData.user;

      // ✅ Inserisci il profilo con l'ID utente corretto
      const { error: insertError } = await supabase
        .from("profiles")
        .insert([{ user_id: user.id, username: nickname }]);

      if (insertError) {
        alert("Error saving profile. Try again.");
        return;
      }

      navigate(`/${nickname}/edit`);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {step === 1 && (
        <form onSubmit={handleRegister} className="w-full max-w-sm">
          <h2 className="text-xl mb-4">Register - Step 1</h2>
          <input type="email" placeholder="Email" className="w-full p-2 border rounded mb-2"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-2 border rounded mb-2"
            value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Next</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSetNickname} className="w-full max-w-sm">
          <h2 className="text-xl mb-4">Register - Step 2</h2>
          <p className="text-gray-500 text-sm">Your profile URL will be: bio.com/<strong>{nickname || "your-username"}</strong></p>
          <input type="text" placeholder="Choose your nickname" className="w-full p-2 border rounded mb-2"
            value={nickname} onChange={(e) => setNickname(e.target.value)} required />
          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">Finish</button>
        </form>
      )}
    </div>
  );
};

export default Register;
