import React from "react";
import AnimalForm from "../../components/animals/AnimalForm";

const ShelterAnimalPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      <h2>Add a New Animal</h2>
      <AnimalForm onSuccess={() => console.log("Animal added!")} />
    </div>
  );
};

export default ShelterAnimalPage;
