import React from "react";
import Navbar from "../../components/navbar/Navbar";
import AnimalForm from "../../components/animals/AnimalForm";
import AnimalList from "../../components/animals/AnimalList";

const ShelterAnimalPage: React.FC = () => {
  return (
    <Navbar>
      <h1>Shelter Animals</h1>
      <AnimalForm onAnimalCreated={() => console.log("Animal added, refresh list")} />
      <AnimalList />
    </Navbar>
  );
};

export default ShelterAnimalPage;