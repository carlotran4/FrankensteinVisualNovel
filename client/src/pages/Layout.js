import { Outlet, Link } from "react-router-dom";
import "../css/layout.css"

const Layout = () => {
  return (
    <>
      <div class="header">
        <Link class="headerLink" to="/">Home</Link>
        <Link class="headerLink" to="/play">Play</Link>
        <Link class="headerLink" target='_blank' to="https://github.com/carlotran4/frankensteinGame">Source Code</Link>
      </div>
      <Outlet />
    </>
  )
};

export default Layout;