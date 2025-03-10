import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import TextWidget from "../components/widgets/types/TextWidget";
import ImageWidget from "../components/widgets/types/ImageWidget";
import LinkWidget from "../components/widgets/types/LinkWidget";
import AddWidgetModal from "../components/modals/AddWidgetModal";
import WidgetList from "../components/widgets/WidgetList"; // new import;

const ProfilePage = ({ isEditing }) => {
  const { user, loading } = useAuth();
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [widgets, setWidgets] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [profileNotFound, setProfileNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setProfileNotFound(false);

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // Se il profilo non esiste
          setProfileNotFound(true);
        } else {
          console.error("Profile fetch error:", error);
        }
        setIsLoading(false);
        return;
      }

      setProfile(data);
      setIsLoading(false);

      // Verifica se l'utente loggato è il proprietario del profilo
      if (user && data.user_id === user.id) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }

      // Recupera i widget solo se il profilo esiste
      const { data: widgetData, error: widgetError } = await supabase
        .from("widgets")
        .select("*")
        .eq("profile_id", data.id)
        .order("order", { ascending: true });

      if (widgetError) {
        console.error("Widgets fetch error:", widgetError);
        return;
      }

      setWidgets(widgetData);
    };

    fetchProfile();
  }, [username, user]);

  useEffect(() => {
    if (!loading && isOwner && !isEditing) {
      navigate(`/${username}/edit`);
    }
    if (!loading && !isOwner && isEditing) {
      navigate(`/${username}`);
    }
  }, [loading, isOwner, isEditing, username, navigate]);

  // 🔄 **Loading Screen**
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen text-gray-500">Loading profile...</div>;
  }

  // ❌ **Profilo non trovato: CTA per registrarsi**
  if (profileNotFound) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-2xl font-bold text-red-500">This profile does not exist!</h1>
        <p className="text-gray-600 mt-2">Do you want to claim <strong>bio.com/{username}</strong>?</p>
        {user ? (
          <button
            onClick={() => navigate("/register")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create your profile now!
          </button>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
          >
            Log in to claim this username
          </button>
        )}
      </div>
    );
  }

  // ✅ **Profilo esistente: Mostra i dati**
  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">{profile.username}'s Profile</h1>
      <p className="text-gray-500">{profile.bio}</p>


      {isEditing && isOwner && (
        <button onClick={() => setIsModalOpen(true)} className="bg-blue-500 text-white p-2 rounded mt-4">
          Aggiungi Widget
        </button>
      )}

      {/* Render added widgets */}
      {widgets.length > 0 && <WidgetList widgets={widgets} />}

       {/* Mostra la modale se attiva */}
       {isModalOpen && (
        <AddWidgetModal
          profileId={profile.id}
          onClose={() => setIsModalOpen(false)}
          onWidgetAdded={(newWidget) => setWidgets([...widgets, newWidget])}
        />
      )}
    </div>
  );
};

export default ProfilePage;