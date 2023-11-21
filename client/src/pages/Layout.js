import { Outlet, Link } from "react-router-dom";
import "../css/layout.css"

const Layout = () => {
  return (
    <>
      <div class="header">
        <Link class="headerLink" to="/">Home</Link>
        <Link class="headerLink" to="/about">About</Link>
        <Link class="headerLink" to="/play">Play</Link>
        <Link class="headerLink" to="/plagiarism">Plagiarism</Link>
      </div>
      <Outlet />
    </>
  )
};

export default Layout;