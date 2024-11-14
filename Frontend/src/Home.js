import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("TOKEN");
    if (!token) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="card">
      <div>HOME</div>
      <div>
        <span> Welcome {localStorage.getItem("USERNAME")} ! </span>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          {" "}
          LOGOUT{" "}
        </button>
      </div>
    </div>
  );
}

export default Home;
