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
var prefix = "/sonmat/"


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
    return(
    <div className="mobile-container">
      <div className="mobile-header">SonMat.</div>
      {this.props.children}
    </div>
    );
  }
}


class mobileSignIn extends React.Component {
  render() {
    let si_click = function() {
      $.post(prefix + "api/signin", {"username": $("#Iusername").val(),
        "password": $("#Ipasswd").val()
      }).done(function(data) {
        var msg = JSON.parse(data)['msg'];
        if (msg == "login fail") {
          console.log("login fail");
        } else if (msg != "-1") {
          console.log("login succeed");
          base.setState({is_login: 1});
          browserHistory.push(prefix+'neweq');
        } else {
          console.log("???")
        }
      });
    }
    return(
      <Row>
      <div className="mobile-signin">
      <FormControl type="text" placeholder="Username" id="Iusername" />
      <FormControl type="password" placeholder="Password" id="Ipasswd" />
      </div>
      <Button bsStyle="success" className="btn-mobile btn-bottom" onClick={si_click}>Login</Button>
      </Row>
    );
  }
}


class mobileNewEq extends React.Component {
  componentDidMount() {
    var $canvas = $('#drawing-canvas').sketchable();

    $('button#clear').click(function(e) {
      e.preventDefault();
      $canvas.sketchable('clear');
    });

    $('button#send').click(function(e) {
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

    $('button#undo').click(function(e) {
      e.preventDefault();
      $canvas.sketchable('undo');
    });

    $('button#redo').click(function(e) {
      e.preventDefault();
      $canvas.sketchable('redo');
    });
  }

  render() {
    return (
      <Col>
        <div className="mobile-canvas-container">
          <div className="canvas-container">
          <canvas id="drawing-canvas" width="900" height="900" className="canvas-mobile" />
          </div>
          <div className="canvas-mobile-controls">
            <Button bsStyle="danger" className="btn-mobile btn-bottom4" id="undo">Undo</Button>
            <Button bsStyle="danger" className="btn-mobile btn-bottom4" id="redo">Redo</Button>
            <Button bsStyle="warning" className="btn-mobile btn-bottom4" id="clear">Clear</Button>
            <Button bsStyle="success" className="btn-mobile btn-bottom4" id="send">Send</Button>
          </div>
        </div>
      </Col>
    );
  }
}

class mobileResult extends React.Component {
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

  renderShareOrSaveButton(idx, exp) {
    const popoverBottom = (
      <Popover id="popover-positioned-bottom" title="Enter Title">
      <FormGroup>
      <FormControl type="text" placeholder="Title" id="saveEqName"/>
      </FormGroup>
      </Popover>
    )
    return (
            <OverlayTrigger trigger="click" placement="bottom" overlay={popoverBottom}>
                <Button bsStyle="mstyle" onClick={this.sfunc.bind(this, this)}>save</Button>
              </OverlayTrigger>
            );
  }

  componentDidMount() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }

  componentDidUpdate() {
    MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
  }

  onSave(_this) {
    $.post(prefix + "api/save", {'name': 'mobile-equation'}).done(function(data) {
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
  render() {
    var res = this.state.res;
    var idx = this.state.idx;
    return(
      <Col>
        <div className="mob-Eq">
          {'$$' + res['tex'] + '$$'}
        </div>
        <Button bsStyle = "success" className="btn-mobile btn-bottom" onClick={this.onSave.bind(this,this)}>Save</Button>
      </Col>
      );
  }
}

ReactDOM.render(
    <Router history = {browserHistory}>
      <Route path = {prefix} component = {App}>
        <IndexRedirect to = {prefix + "signin"} />
        <Route path = {prefix + "signin"} component = {mobileSignIn} />
        <Route path = {prefix + "neweq"} component = {mobileNewEq} />
        <Route path = {prefix + "show"} component = {mobileResult} />
      </Route>
    </Router>,
    document.getElementById('content')
);

