import { useState } from "react";
import "./App.css";
import { httpBatchLink } from "@trpc/client";
import type { TRPCRouter } from "../../server/src/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Create from "./pets/Create";
import Detail from "./pets/Detail";
import List from "./pets/List";
import { createTRPCReact } from "@trpc/react-query";

const BACKEND_URL = "http://localhost:8080/pet";
export const trpc = createTRPCReact<TRPCRouter>();

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: BACKEND_URL,
        }),
      ],
    })
  );
  const [detailId, setDetailId] = useState(-1);
  const setDetail = (id: number) => {
    setDetailId(id);
  };
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <div className="App">
          <Create />
          <List setDetail={setDetail} />
          {detailId > 0 ? <Detail id={detailId} /> : null}
        </div>
      </QueryClientProvider>
    </trpc.Provider>
  );
}

export default App;
