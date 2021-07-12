import { Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsFileRichtext, BsBoxArrowInRight, BsBoxArrowInLeft } from 'react-icons/bs';

function NavBar(props) {
  return (
    <Navbar bg="primary" variant="dark" fixed="top">
      {/* Logo and title */}
      <Navbar.Brand href="/">
        <BsFileRichtext title={"Logo"} size={"30px"}></BsFileRichtext>{" "}
        Meme Generator
      </Navbar.Brand>
      {/* Login/Logout button */}
      <Navbar.Collapse className="justify-content-end">
        {props.loggedIn
          ? <>
            <Navbar.Text>
              Signed in as: {props.name}{" "}
              <Button variant="primary" onClick={props.doLogout}><BsBoxArrowInRight title={"Logout"} size={"30px"}></BsBoxArrowInRight></Button>
            </Navbar.Text>
          </>
          : <>
            <Navbar.Text>
              <Link to="/login">
                <Button variant="primary">
                  Login <BsBoxArrowInLeft title={"Login"} size={"30px"} />
                </Button>
              </Link>
            </Navbar.Text>
          </>
        }
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavBar;
