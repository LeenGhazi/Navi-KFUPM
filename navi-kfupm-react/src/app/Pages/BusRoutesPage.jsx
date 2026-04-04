import { useAuth } from "../AuthContext";

function BusRoutesPage() {
  const { role } = useAuth();

  return (
    <div>
      <h1>Campus Bus Routes</h1>

      {role === "user" && <button>Request Route</button>}
      {role === "admin" && <button>Manage Routes</button>}
      {role === "technical" && <button>Edit Routes</button>}
    </div>
  );
}


export default BusRoutesPage;