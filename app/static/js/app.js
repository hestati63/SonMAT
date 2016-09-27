// shorten element in js module.
var Route = ReactRouter.Route;
var Router = ReactRouter.Router;
var browserHistory = ReactRouter.browserHistory;
var IndexRedirect = ReactRouter.IndexRedirect;
var Link = ReactRouter.Link;
var Redirect = ReactRouter.Redirect;
var Nav = ReactBootstrap.Nav;
var Navbar = ReactBootstrap.Navbar;
var NavItem = ReactBootstrap.NavItem;
var Col = ReactBootstrap.Col;
var PageHeader = ReactBootstrap.PageHeader;
var LinkContainer = ReactRouterBootstrap.LinkContainer;
var Jumbotron = ReactBootstrap.Jumbotron;
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;

// temp values.
const ACTIVE = { color: 'red' }
var is_login = 0;
var show = 0;

class App extends React.Component {

  render() {
    var requirelogin = (
        <div>
          <Navbar id="nav">
           <Navbar.Header>
            <Navbar.Brand>
              SonMat
            </Navbar.Brand>
            <Navbar.Toggle />
            </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
             <LinkContainer to='home'>
               <NavItem eventkey={1}>Home</NavItem>
             </LinkContainer>
             <LinkContainer to='about'>
               <NavItem eventkey={2}>About</NavItem>
             </LinkContainer>
             <LinkContainer to='NewEquation'>
                <NavItem eventKey={3}>New Equation</NavItem>
             </LinkContainer>
           </Nav>
           <Nav pullRight>
               <NavItem eventKey={4}>Sign In</NavItem>
             <LinkContainer to='signup'>
               <NavItem eventKey={5}>Sign Up</NavItem>
             </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.props.children}
      </div>
      );

      return is_login ? logined : requirelogin;
    }
}

// do Nothing
class None extends React.Component {
  render() {
    return (<h1></h1>);
  }
}

// home
class Home extends React.Component {
  render() {
    return (
        <Col xs={10} xsOffset={1}>
          <Jumbotron>
            <div id="jt">
            <h1>SonMat</h1>
            <p>This is a simple handwriting formula IME service based on <a target="_blank" href="https://github.com/falvaro/seshat">seshat</a>.</p>
            <p><LinkContainer to="NewEquation"><Button bsStyle="primary">Try it</Button></LinkContainer></p>
            </div>
          </Jumbotron>
        </Col>
        );
  }
}

// about
class About extends React.Component {
    render() {
        return (
            <Col xs={10} xsOffset={1}>
              <PageHeader>SonMat</PageHeader>
              SonMat is Handwriting Formula IME service based on <a target="_blank" href="https://github.com/falvaro/seshat">seshat</a>.

            </Col>
        );
    }
}
// new equation
class NewEquation extends React.Component {
  render() {
    return (<h1>Ang Gimotti!</h1>);
  }
}
// my equation
// signin
// signup
// mypage
// logout
function logout(nextState, replaceState) {
    //$.post("api/logout");
    alert("succesfully logged out");
    is_login = false;
    replaceState({ nextPathname: nextState.location.pathname }, '/')
}


ReactDOM.render(<Router history = {browserHistory}>
      <Route path = "/" component = {App}>
         <IndexRedirect to = "home" />
         <Route path = "home" component = {Home} />
         <Route path = "about" component = {About} />
         <Route path = "NewEquation" component = {NewEquation} />
         <Route path = "logout" component = {None} onEnter={logout} />
           
      </Route>
   </Router>, document.getElementById('content'));
