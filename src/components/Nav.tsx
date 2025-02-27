import { Link } from "react-router-dom";

export const Nav = () => {
  return (
    <div>
      <nav>
        <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box">
          <li className="bg-base-100">
            <Link to="/" className="btn btn-ghost text-xl">
              Home
            </Link>
          </li>
          <li className="bg-base-100">
            <Link to="/box" className="btn btn-ghost text-xl">
              Box
            </Link>
          </li>
          <li className="bg-base-100">
            <Link to="/house" className="btn btn-ghost text-xl">
              House
            </Link>
          </li>
          <li className="bg-base-100">
            <Link to="/village" className="btn btn-ghost text-xl">
              Village
            </Link>
          </li>
          <li className="bg-base-100">
            <Link to="/basketball" className="btn btn-ghost text-xl">
              Basketball
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
