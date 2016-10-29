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
   constructor(props) {
         super(props);
         this.state = { si_show: false, su_show: false};
   };

  render() {
    let si_close = () => this.setState({si_show:false});
    let su_close = () => this.setState({su_show:false});

    var requirelogin = (
      <div>
        <Navbar id="nav">
          <Navbar.Header>
            <Navbar.Brand>
            <img src="/images/logo.png" />
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
              <NavItem eventKey={4} onSelect={() => this.setState({si_show: true})}>Sign In</NavItem>
              <NavItem eventKey={5} onSelect={() => this.setState({su_show: true})}>Sign Up</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <Modal show={this.state.si_show} onHide={si_close}>
          <Modal.Header closeButton>
            <Modal.Title><h2>Sign In</h2></Modal.Title>
          </Modal.Header>
          <Modal.Body>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={si_close}>Close</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.su_show} onHide={su_close}>
          <Modal.Header closeButton>
            <Modal.Title><h2>Sign Up</h2></Modal.Title>
          </Modal.Header>
          <Modal.Body>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={su_close}>Close</Button>
          </Modal.Footer>
        </Modal>

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

      $.post('/api/new', { 'strokes': JSON.stringify(strokes) },
        function(data) {
          browserHistory.push('show#' + data);
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
        <div className="canvas-container">
        <i className="pin"></i>
        <canvas id="drawing-canvas" width="480" height="300" className="postit yellow" />
        </div>
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
  componentDidMount() {
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  };
  componentDidUpdate() {
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  };

  render() {
    var idx = window.location.hash.split('#')[1];
    var res = null;
    $.ajax({
       url: "/api/show/" + idx,
       type: 'get',
       dataType: 'html',
       async: false,
       success: function(data) {
           res = JSON.parse(data);
       }
    });
    return (
      <Col xs={10} xsOffset={1}>
        <PageHeader id="name">
        <Col xs={6}>
        {res['name']}
        </Col>
        <Col xs={6} id="btns" className="text-right">
        <Button bsStyle="mstyle">share</Button>
        &nbsp;
        <Button bsStyle="mstyle">save</Button>
        </Col>
        </PageHeader>
        <Label bsStyle="success">Converted Result</Label><br />
        <div id="Eq">
        {'$$' + res['tex'] + '$$'}
        </div>
        <hr />
        <Panel header="Tex" bsStyle="primary">{res['tex']}</Panel><br />
        <Panel header="Hangul" bsStyle="info">{res['hangul']}</Panel><br />
        <Panel header="Word" bsStyle="warning">{res['word']}</Panel><br />
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
          {'$$' + this.props.val + '$$'}
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
  componentDidMount() {
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  };
  componentDidUpdate() {
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  };

  render() {
    return (
      <Row>
        <Col xs={10} xsOffset={1}>
          <EquationGal name="MyEquation" val="2+1" idx={1}></EquationGal>
          <EquationGal name="Calculus1" val="1+2" idx={2}></EquationGal>
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
