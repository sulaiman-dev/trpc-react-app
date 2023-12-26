import "./List.css";
import { trpc } from "../App";
import type { Pet } from "../../../server/src/router";
import { useState } from "react";

function List(props: { setDetail: (id: number) => void }) {
  const [error, setError] = useState("");
  const pets = trpc.list.useQuery();
  const deleteMutation = trpc.delete.useMutation({
    onSuccess: () => {
      pets.refetch();
    },
    onError: (data) => {
      setError(data.message);
    },
  });

  const handleDelete = async (id: number) => {
    deleteMutation.mutate({ id });
  };

  const petRow = (pet: Pet) => {
    return (
      <div key={pet.id}>
        <span>{pet.id}</span>
        <span>{pet.name}</span>
        <span>
          <a href="#" onClick={props.setDetail.bind(null, pet.id)}>
            detail
          </a>
        </span>
        <span>
          <a href="#" onClick={handleDelete.bind(null, pet.id)}>
            delete
          </a>
        </span>
      </div>
    );
  };

  return (
    <div className="List">
      <h2>Pets</h2>
      <span>{error}</span>
      {pets.data &&
        pets.data.map((pet) => {
          return petRow(pet);
        })}
    </div>
  );
}

export default List;
