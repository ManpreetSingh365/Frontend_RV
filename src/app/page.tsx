import Link from "next/link";

const Homepage = () => {
  return (
    <div>
      Home Page

      <Link href={"/login"} className="m-5">Login</Link>
      <Link href={"/admin/panel"} className="m-5">Admin Panel</Link>
      <Link href={"/user/panel"} className="m-5">User Panel</Link>
    </div>
  );
};

export default Homepage;
