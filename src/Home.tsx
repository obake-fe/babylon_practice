import { Link } from "react-router-dom";

export const Home = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello world!</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/box">Box</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
