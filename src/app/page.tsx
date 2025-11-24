import Link from "next/link";

const Homepage = () => {
  return (
    <div>
      Home Page

      <Link href={"/login"} className="m-5">Login</Link>
      <Link href={"/panel"} className="m-5">Panel</Link>
    </div>
  );
};

export default Homepage;
