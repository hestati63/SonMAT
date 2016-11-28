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
var ControlLabel = ReactBootstrap.ControlLabel;
var FormControl = ReactBootstrap.FormControl;

var LinkContainer = ReactRouterBootstrap.LinkContainer;

// temp values.
var is_login = 0;
class App extends React.Component {
   constructor(props) {
     super(props);
     this.state = {si_show: false, su_show: false};
   };

  render() {
    let si_close = () => this.setState({si_show: false});
    let su_close = () => this.setState({su_show: false});
    let si_click = function() {
      $.post("/api/signin", {"username": $("#Iusername").val(),
        "password": $("#Ipasswd").val()
      }).done(function(data) {
        var msg = JSON.parse(data)['msg'];
        if (msg == "login fail") {
          toastr.error(msg);
        } else if (msg != "-1") {
          toastr.success(msg);
          is_login = 1;
          si_close();
        }
      });
    };
    let su_click = function() {
      $.post("/api/signup", {"username": $("#Uusername").val(),
        "password": $("#Upasswd").val(),
        "passwordchk": $("#Upasswdchk").val(),
        "email": $("#Uemail").val()}
      ).done(function(data) {
        var msg = JSON.parse(data)['msg'];
        if (msg == "Successfully joined.") {
          toastr.success(msg);
          su_close();
        } else if (msg != -1) {
          toastr.error(msg);
        }
      });
    };

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
          <form onSubmit={e => e.preventDefault()}>
            <Modal.Header closeButton>
              <Modal.Title><h2>Sign In</h2></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ControlLabel>Username</ControlLabel>
              <FormControl type="text" placeholder="Enter Username" id="Iusername" />
              <ControlLabel>Password</ControlLabel>
              <FormControl type="password" placeholder="Enter Password" id="Ipasswd" />
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" onClick={si_click}>Sign in</Button>
            </Modal.Footer>
          </form>
        </Modal>

        <Modal show={this.state.su_show} onHide={su_close}>
          <form onSubmit={e => e.preventDefault()}>
            <Modal.Header closeButton>
              <Modal.Title><h2>Sign Up</h2></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ControlLabel>Username</ControlLabel>
              <FormControl type="text" placeholder="Enter Username" id="Uusername" />
              <ControlLabel>Password</ControlLabel>
              <FormControl type="password" placeholder="Enter Password" id="Upasswd" />
              <ControlLabel>Password Check</ControlLabel>
              <FormControl type="password" placeholder="Reenter Password" id="Upasswdchk" />
              <ControlLabel>Email</ControlLabel>
              <FormControl type="text" placeholder="Enter Email" id="Uemail" />
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" onClick={su_click}>Sign up</Button>
            </Modal.Footer>
          </form>
        </Modal>

        {this.props.children}
      </div>
    );
    var logined = (
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
              <LinkContainer to='MyEquation'>
                <NavItem eventKey={4}>MyEquation</NavItem>
              </LinkContainer>

            </Nav>
            <Nav pullRight>
              <NavItem eventKey={5} onSelect={() => this.setState({si_show: true})}>Mypage</NavItem>
              <NavItem eventKey={6} onSelect={() => this.setState({su_show: true})}>Logout</NavItem>
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

      $.post('/api/new', { 'strokes': JSON.stringify(strokes) },
        function(data) {
          var res = JSON.parse(data);
          if(res['res'] == 1)
          {
            console.log(res['msg']);
            //console.log(res['fix']);
            browserHistory.push('show');
          }
          else
          {
            toastr.error("Fail to convert message.");
          }
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
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }

  componentDidUpdate() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }

  onSave() {
    $.post("/api/save").done(function(data) {
      var result = JSON.parse(data);
      if (result['res'] == -1) {
        toastr.error(result['msg']);
      } else {
        toastr.success(result['msg']);
        var expId = result['res'];
        browserHistory.push('show#' + expId);
      }
    });
  }

  onShare(idx) {
    $.post("/api/share/" + idx).done(function(data) {
      var result = JSON.parse(data);
      if (result['res'] == -1) {
        toastr.error(result['msg']);
      } else {
        toastr.success(result['msg']);
      }
    });
  }

  renderShareOrSaveButton(idx) {
    if (idx == "0") {
      return (
        <Button bsStyle="mstyle" onClick={this.onSave}>save</Button>
      );
    } else {
      return (
        <Button bsStyle="mstyle" onClick={this.onShare.bind(this, idx)}>share</Button>
      );
    }
  }

  render() {
    var idx = window.location.hash.split('#')[1];
    if (idx == undefined || !/^\d+$/.test(idx))
      idx = "0";
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
    if (res['msg'] == -1) {
      browserHistory.push(-1);
    }
    return (
      <Col xs={10} xsOffset={1}>
        <PageHeader id="name">
          <Col xs={6}>
            {res ? res['name'] : ''}
          </Col>
          <Col xs={6} id="btns" className="text-right">
            {this.renderShareOrSaveButton(idx)}
          </Col>
        </PageHeader>
        <Label bsStyle="success">Converted Result</Label><br />
        <div id="Eq">
          {res ? '$$' + res['tex'] + '$$' : ''}
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
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }

  componentDidUpdate() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }

  renderEquation(exp, i) {
    return (
      <EquationGal name={exp.name} val={exp.tex} idx={i} />
    );
  }

  render() {
    var res = null;
    $.ajax({
       url: "/api/listing",
       type: 'get',
       dataType: 'html',
       async: false,
       success: function(data) {
         res = JSON.parse(data);
       }
    });
    return (
      <Row>
        <Col xs={10} xsOffset={1}>
          {res['data'].map((exp, i) => {
            return this.renderEquation(exp, i);
          })}
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
