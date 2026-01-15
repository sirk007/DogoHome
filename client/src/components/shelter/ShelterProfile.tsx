import { useEffect, useState } from "react";
import axios from "axios";

interface ShelterProfileData {
  id: number;
  username: string;
  email: string;
  shelterName: string;
  countyId: number;
  address: string;
  phoneNumber: string;
  userType: "Shelter";
}

const ShelterProfile = () => {
  const [data, setData] = useState<ShelterProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem("accessToken");
        if (!token) throw new Error("Missing token");

        const res = await axios.get<ShelterProfileData>(
          "http://localhost:3001/shelters/authShelter",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load shelter profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading shelter profile…</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return null;

  return (
    <section className="shelter-profile">
      <h2>{data.shelterName}</h2>

      <div>
        <p>
          <strong>Username:</strong> {data.username}
        </p>
        <p>
          <strong>Email:</strong> {data.email}
        </p>
        <p>
          <strong>Phone:</strong> {data.phoneNumber}
        </p>
      </div>

      <div>
        <p>
          <strong>Address:</strong> {data.address}
        </p>
        <p>
          <strong>County ID:</strong> {data.countyId}
        </p>
      </div>
    </section>
  );
};

export default ShelterProfile;
