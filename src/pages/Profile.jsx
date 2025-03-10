import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/${username}/edit`);
    }
  }, [user, username, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-xl font-bold">Welcome to {username}'s Profile</h1>
    </div>
  );
};

export default Profile;
