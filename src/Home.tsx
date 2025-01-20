import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <nav>
        <ul>
          <li className="navbar bg-base-100">
            <Link to="/" className="btn btn-ghost text-xl">
              Home
            </Link>
          </li>
          <li className="navbar bg-base-100">
            <Link to="/box" className="btn btn-ghost text-xl">
              Box
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
