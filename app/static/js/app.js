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
var Jumbotron = ReactBootstrap.Jumbotron;
var Button = ReactBootstrap.Button;
var Modal = ReactBootstrap.Modal;
var Panel = ReactBootstrap.Panel;
var Row = ReactBootstrap.Row;
var Label = ReactBootstrap.Label;
var Thumbnail = ReactBootstrap.Thumbnail;

var LinkContainer = ReactRouterBootstrap.LinkContainer;

// temp values.
var is_login = 0;

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
  componentDidMount() {
    var $canvas = $('#drawing-canvas').sketchable();

    $('a#clear').click(function(e) {
      e.preventDefault();
      $canvas.sketchable('clear');
    });

    $('a#send').click(function(e) {
      var strokes = $canvas.sketchable('strokes');
      for (var i = 0; i < strokes.length; i++) {
        for (var j = 0, stroke = strokes[i]; j < stroke.length; j++) {
          strokes[i][j] = [strokes[i][j][0], strokes[i][j][1]];
        }
      }

      $.post('/api/new_equation', { 'strokes': JSON.stringify(strokes) },
        function(data) {
          browserHistory.push(data);
        }
      );
    });

    $('a#undo').click(function(e) {
      e.preventDefault();
      $canvas.sketchable('undo');
    });

    $('a#redo').click(function(e) {
      e.preventDefault();
      $canvas.sketchable('redo');
    });
  }

  render() {
    return (
      <Col xs={10} xsOffset={1}>
        <PageHeader>New Equation</PageHeader>
        <canvas id="drawing-canvas" width="480" height="200" />
        <div className="controls">
          <a href="#" id="clear">Clear</a>
          <a href="#" id="send">Send</a>
          <a href="#" id="undo">Undo</a>
          <a href="#" id="redo">Redo</a>
        </div>
      </Col>
    );
  }
}

// show
class Show extends React.Component {
  render() {
    var idx = window.location.hash.split('#')[1];
    // $.post("/api");
    var get = '{"latex": "x^2+1", "ci": "/formula/1.gif", "name": "MyNewEquation", "wi": "/formula/1.gif", "hangul": "{x}^{2}+1"}';
    var data = JSON.parse(get);
    return (
      <Col xs={10} xsOffset={1}>
        <PageHeader id="name">{data['name']}</PageHeader>
        <Label bsStyle="primary">Your input</Label><br />
        <img src={data['wi']} /><br />
        <Label>Converted Result</Label><br />
        <img src={data['ci']} />
        <hr />
        <Panel header="LaTex" bsStyle="primary">{data['latex']}</Panel><br />
        <Panel header="Word" bsStyle="success">{data['hangul']}</Panel><br />
        <Panel header="Hangul" bsStyle="info">{data['hangul']}</Panel><br />
      </Col>
    );
  }
}

// my equation
var EquationGal = React.createClass({
  render: function() {
    return (
      <Col xs={6} md={4}>
        <div className="card">
          <h3>{this.props.name}</h3>
          <img src={this.props.url} />
          <p>
            <LinkContainer to={"show#" + this.props.idx}>
              <Button bsStyle="primary">Show</Button>
            </LinkContainer>
            &nbsp;
            <LinkContainer to={"share#" + this.props.idx}>
              <Button bsStyle="info">Share</Button>
            </LinkContainer>
            &nbsp;
            <LinkContainer to={"delete#" + this.props.idx}>
              <Button bsStyle="danger">Delete</Button>
            </LinkContainer>
          </p>
        </div>
      </Col>
    );
  }
});

class MyEquation extends React.Component {
  render() {
    return (
      <Row>
        <Col xs={10} xsOffset={1}>
          <EquationGal name="MyEquation" url="/formula/1.gif" idx={1}></EquationGal>
          <EquationGal name="Calculus1" url="/formula/2.gif" idx={2}></EquationGal>
          <EquationGal name="Calculus2" url="/formula/3.gif" idx={3}></EquationGal>
        </Col>
      </Row>
    );
  }
}

// signin
// signup
// mypage
// logout
function logout(nextState, replaceState) {
  // $.post("api/logout");
  alert("succesfully logged out");
  is_login = false;
  replaceState({ nextPathname: nextState.location.pathname }, '/')
}

ReactDOM.render(
  <Router history = {browserHistory}>
    <Route path = "/" component = {App}>
      <IndexRedirect to = "home" />
      <Route path = "home" component = {Home} />
      <Route path = "about" component = {About} />
      <Route path = "NewEquation" component = {NewEquation} />
      <Route path = "MyEquation" component = {MyEquation} />
      <Route path = "show" component = {Show} />
      <Route path = "logout" component = {None} onEnter={logout} />
    </Route>
  </Router>,
  document.getElementById('content')
);
