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
var Popover = ReactBootstrap.Popover;
var OverlayTrigger = ReactBootstrap.OverlayTrigger;
var FormGroup = ReactBootstrap.FormGroup;
var LinkContainer = ReactRouterBootstrap.LinkContainer;

var is_login = -1;
var base = 123;
var prefix = '/sonmat/';
class App extends React.Component {
   constructor(props) {
     super(props);
     base = this;
     var res = $.ajax({
               type: "GET",
               url: prefix + 'api/check',
               async: false
           }).responseText;
    res = JSON.parse(res);
    base.state = {si_show: false, su_show: false, my_show: false, is_login: res['msg']};
   };

  render() {
    let si_close = () => this.setState({si_show: false});
    let su_close = () => this.setState({su_show: false});
    let my_close = () => this.setState({my_show: false});
    let si_click = function() {
      $.post(prefix + "api/signin", {"username": $("#Iusername").val(),
        "password": $("#Ipasswd").val()
      }).done(function(data) {
        var msg = JSON.parse(data)['msg'];
        if (msg == "login fail") {
          toastr.error(msg);
        } else if (msg != "-1") {
          toastr.success(msg);
          base.setState({is_login: 1});
          si_close();
        }
      });
    };
    let su_click = function() {
      $.post(prefix + "api/signup", {"username": $("#Uusername").val(),
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

    let my_click = function() {
      $.post(prefix + "api/mypage",
        {"password": $("#Mpasswd").val(),
         "npassword": $("#Mupasswd").val(),
         "npasswordchk": $("#Mupasswdchk").val()}
      ).done(function(data) {
        var msg = JSON.parse(data)['msg'];
        if (msg == "Successfully saved.") {
          toastr.success(msg);
          my_close();
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
              <img src= {prefix + "images/logo.png"} />
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to={prefix + 'home'}>
                <NavItem eventkey={1}>Home</NavItem>
              </LinkContainer>
              <LinkContainer to={prefix + 'about'}>
                <NavItem eventkey={2}>About</NavItem>
              </LinkContainer>
              <LinkContainer to={prefix + 'NewEquation'}>
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
              <img src= {prefix + "images/logo.png"} />
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
            <Nav>
              <LinkContainer to={prefix + 'home'}>
                <NavItem eventkey={1}>Home</NavItem>
              </LinkContainer>
              <LinkContainer to={prefix + 'about'}>
                <NavItem eventkey={2}>About</NavItem>
              </LinkContainer>
              <LinkContainer to={prefix + 'NewEquation'}>
                <NavItem eventKey={3}>New Equation</NavItem>
              </LinkContainer>
              <LinkContainer to={prefix + 'MyEquation'}>
                <NavItem eventKey={4}>MyEquation</NavItem>
              </LinkContainer>

            </Nav>
            <Nav pullRight>
              <NavItem eventKey={5} onSelect={() => this.setState({my_show: true})}>Mypage</NavItem>
              <NavItem eventKey={6} onSelect={() => {$.get(prefix + 'api/logout').done(function(data){toastr.success(JSON.parse(data)['msg'])});this.setState({is_login: 0})}}>Logout</NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Modal show={this.state.my_show} onHide={my_close}>
          <form onSubmit={e => e.preventDefault()}>
            <Modal.Header closeButton>
              <Modal.Title><h2>Mypage</h2></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ControlLabel>Current Password</ControlLabel>
              <FormControl type="password" placeholder="Enter Password" id="Mpasswd" />
              <ControlLabel>Change Password</ControlLabel>
              <FormControl type="password" placeholder="Enter New Password" id="Mupasswd" />
              <ControlLabel>Password Check</ControlLabel>
              <FormControl type="password" placeholder="Reenter New Password" id="Mupasswdchk" />
            </Modal.Body>
            <Modal.Footer>
              <Button type="submit" onClick={my_click}>Save</Button>
            </Modal.Footer>
          </form>
        </Modal>
        {this.props.children}
      </div>
    );

    return this.state.is_login ? logined : requirelogin;
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
            <p><LinkContainer to={prefix + "NewEquation"}><Button bsStyle="primary">Try it</Button></LinkContainer></p>
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

      $.post(prefix + 'api/new', { 'strokes': JSON.stringify(strokes) },
        function(data) {
          var res = JSON.parse(data);
          if(res['res'] == 1)
          {
            console.log(res['msg']);
            //console.log(res['fix']);
            browserHistory.push(prefix+'show');
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
  constructor(props){
    super(props);
    var idx = window.location.hash.split('#')[1];
    if (idx == undefined || !/^\d+$/.test(idx))
      idx = "0";
    var data = $.ajax({
       url: prefix + "api/show/" + idx,
       type: 'get',
       dataType: 'html',
       async: false,
    }).responseText;
    var res = JSON.parse(data);
    if (res['msg'] == -1) {
      browserHistory.push(prefix + "home");
    }
    this.state = {res: res, idx: idx, sst: 0};
  }

  componentDidMount() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }

  componentDidUpdate() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }

  onSave(_this) {
    $.post(prefix + "api/save", {'name': $("#saveEqName").val()}).done(function(data) {
      var result = JSON.parse(data);
      if (result['res'] == -1) {
        toastr.error(result['msg']);
      } else {
        toastr.success(result['msg']);
        var expId = result['res'];
        _this.setState({idx: expId});
        browserHistory.push(prefix+'show#' + expId);
      }
    });
  }

  onShare(idx, _this) {
    $.post(prefix + "api/share/" + idx).done(function(data) {
      var result = JSON.parse(data);
      if (result['res'] == -1) {

        toastr.error(result['msg']);
      } else {
        toastr.success(result['msg']);
        var res = _this.state.res;
        res['shared'] = true;
        _this.setState({res: res});
      }
    });
  }

  onUnshare(idx, _this) {
    $.post(prefix + "api/unshare/" + idx).done(function(data) {
      var result = JSON.parse(data);
      if (result['res'] == -1) {
        toastr.error(result['msg']);
      } else {
        toastr.success(result['msg']);
        var res = _this.state.res;
        res['shared'] = false;
        _this.setState({res: res});
      }
    });
  }

  sfunc(_this){
    if(_this.state.sst == 0){
      _this.setState({sst: 1});
    }
    else if(_this.state.sst == 1){
      _this.onSave(_this);
    }
  }

  renderShareOrSaveButton(idx, exp) {
    const popoverBottom = (
      <Popover id="popover-positioned-bottom" title="Enter Title">
        <FormGroup>
          <FormControl type="text" placeholder="Title" id="saveEqName"/>
        </FormGroup>
      </Popover>
    )

    if (idx == '0') {

      return (
        <OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom}>
          <Button bsStyle="mstyle" onClick={this.sfunc.bind(this, this)}>save</Button>
        </OverlayTrigger>
      );
    } else if (exp['shared']) {
      return (
        <Button bsStyle="mstyle" onClick={this.onUnshare.bind(this, idx, this)}>unshare</Button>
      );
    } else {
      return (
        <Button bsStyle="mstyle" onClick={this.onShare.bind(this, idx, this)}>share</Button>
      );
    }
  }

  render() {
    var res = this.state.res;
    var idx = this.state.idx;
    console.log(idx);
    return (
      <Col xs={10} xsOffset={1}>
        <PageHeader id="name">
          <Col xs={6}>
            {res['name']}
          </Col>
          <Col xs={6} id="btns" className="text-right">
            {this.renderShareOrSaveButton(idx, res)}
          </Col>
        </PageHeader>
        <Label bsStyle="success">Converted Result</Label><br />
        <div id="Eq">
          {'$$' + res['tex'] + '$$'}
        </div>
        <hr />
        <Panel header="Tex" bsStyle="primary">{res['tex']}</Panel><br />
        <Panel header="Hangul" bsStyle="info">{res['hangul']}</Panel><br />
        <Panel header="Word" bsStyle="warning"><img src={"http://latex.codecogs.com/gif.latex?" + res['tex']} border="0"/></Panel><br />
      </Col>
    );
  }
}

// my equation
var EquationGal = React.createClass({
  getInitialState: function() {
    return {
      shared: this.props.shared
    };
  },

  componentDidMount: function() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.container]);
  },

  componentDidUpdate: function() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, this.container]);
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      shared: nextProps.shared
    });
  },

  onShare: function() {
    var self = this;
    $.post(prefix + "api/share/" + this.props.idx).done(function(data) {
      var result = JSON.parse(data);
      if (result['res'] == -1) {
        toastr.error(result['msg']);
      } else {
        toastr.success(result['msg']);
        self.setState({shared: !self.state.shared});
      }
    });
  },

  onUnshare: function() {
    var self = this;
    $.post(prefix + "api/unshare/" + this.props.idx).done(function(data) {
      var result = JSON.parse(data);
      if (result['res'] == -1) {
        toastr.error(result['msg']);
      } else {
        toastr.success(result['msg']);
        self.setState({shared: !self.state.shared});
      }
    });
  },

  onDelete: function() {
    var self = this;
    $.post(prefix + "api/delete/" + this.props.idx).done(function(data) {
      var result = JSON.parse(data);
      if (result['res'] == -1) {
        toastr.error(result['msg']);
      } else {
        toastr.success(result['msg']);
        if (self.props.onDelete) {
          self.props.onDelete();
        }
      }
    });
  },

  renderShareButton: function() {
    if (this.state.shared) {
      return (
        <Button bsStyle="info" onClick={this.onUnshare}>Unshare</Button>
      );
    } else {
      return (
        <Button bsStyle="info" onClick={this.onShare}>Share</Button>
      );
    }
  },

  render: function() {
    return (
      <Col xs={6} md={4}>
        <div className="card">
          <h3>{this.props.name}</h3>
          <div ref={(container) => { this.container = container; }}>{'$$' + this.props.val + '$$'}</div>
          <p className="card-buttons">
            <LinkContainer to={prefix + "show#" + this.props.idx}>
              <Button bsStyle="primary">Show</Button>
            </LinkContainer>
            &nbsp;
            {this.renderShareButton()}
            &nbsp;
            <Button bsStyle="danger" onClick={this.onDelete}>Delete</Button>
          </p>
        </div>
      </Col>
    );
  }
});

class MyEquation extends React.Component {
  constructor(props) {
    super(props);
    var res = $.ajax({
      url: prefix + "api/listing",
      type: 'get',
      dataType: 'html',
      async: false
    }).responseText;
    res = JSON.parse(res);
    this.state = {equations: res['data']};
  }

  onDelete(id) {
    var equations = this.state.equations;
    for (var i = 0; i < equations.length; i++) {
      if (equations[i].id == id) {
        equations.splice(i, 1);
        this.setState({equations: equations});
        break;
      }
    }
  }

  renderEquation(exp) {
    return (
      <EquationGal name={exp.name} val={exp.tex} idx={exp.id} shared={exp.shared} onDelete={this.onDelete.bind(this, exp.id)} />
    );
  }

  render() {
    return (
      <Row>
        <Col xs={10} xsOffset={1}>
          {this.state.equations.map((exp) => {
            return this.renderEquation(exp);
          })}
        </Col>
      </Row>
    );
  }
}


ReactDOM.render(
  <Router history = {browserHistory}>
    <Route path = {prefix} component = {App}>
      <IndexRedirect to = {prefix + "home"} />
      <Route path = {prefix + "home"} component = {Home} />
      <Route path = {prefix + "about"} component = {About} />
      <Route path = {prefix + "NewEquation"} component = {NewEquation} />
      <Route path = {prefix + "MyEquation"} component = {MyEquation} />
      <Route path = {prefix + "show"} component = {Show} />
    </Route>
  </Router>,
  document.getElementById('content')
);
