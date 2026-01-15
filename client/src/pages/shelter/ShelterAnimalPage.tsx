import React from "react";
import Navbar from "../../components/layout/Navbar";
import AnimalForm from "../../components/animals/AnimalForm";
import AnimalList from "../../components/animals/AnimalList";

/**
 * --------------------------------------------
 * ShelterAnimalPage Component
 * --------------------------------------------
 * Page for managing shelter animals:
 * - Allows adding new animals via `AnimalForm`
 * - Displays existing animals via `AnimalList`
 * - Wrapped in `Navbar` for consistent navigation
 */

const ShelterAnimalPage: React.FC = () => {
  return (
    <Navbar>
      {/* 2. Animal Form */}
      <h1>Shelter Animals</h1>

      {/*-----------------------------
      // Animal Form 
      // Provides a form to add new animals
      // -----------------------------
      */}
      <AnimalForm
        onAnimalCreated={() => console.log("Animal added, refresh list")}
      />

      {/*-----------------------------
      // Animal List
      // Displays all animals associated with the shelter
      // -----------------------------
      */}
      <AnimalList />
    </Navbar>
  );
};

export default ShelterAnimalPage;
