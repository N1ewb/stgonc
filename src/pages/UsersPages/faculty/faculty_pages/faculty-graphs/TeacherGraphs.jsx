import { useAuth } from "../../../../../context/auth/AuthContext";
import { useDB } from "../../../../../context/db/DBContext";

const TeacherGraphs = () => {

  const auth = useAuth();
  const db = useDB();
 

  return (
    <div>
      <div className="temp-container">
       ......
      </div>
    </div>
  );
};

export default TeacherGraphs;
