import "./Detail.css";
import { trpc } from "../App";

function Detail(props: { id: number }) {
  const pet = trpc.get.useQuery(props.id);

  return pet.data ? (
    <div className="Detail">
      <h2>Detail</h2>
      <div>{pet.data.id}</div>
      <div>{pet.data.name}</div>
    </div>
  ) : (
    <div className="Detail"></div>
  );
}

export default Detail;
