import React, { Component } from 'react';


class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uname: '',
      passwd: '',
      };

    this.handleChangeUname = this.handleChangeUname.bind(this);
    this.handleChangePasswd = this.handleChangePasswd.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit(event) {
    
    this.props.parentCallback(this.state.uname,this.state.passwd)

    event.preventDefault();
  }

  handleChangeUname(event) {
    this.setState({
      uname: event.target.value,
      });
  }

  handleChangePasswd(event) {
    this.setState({
      passwd: event.target.value,
      });
  }


  render() {
    return (
        <div >
          <form onSubmit={this.handleSubmit}>
            <label>
              Username:
              <input type="text" value={this.state.uname} onChange={this.handleChangeUname} />
            </label>
            <br/>
            <label>
              Password:
              <input type="password" value={this.state.passwd} onChange={this.handleChangePasswd} />
            </label>
            <br/>
            <input type="submit" value="Log in" />
          </form>
        </div>
    );
  }
}

export default Form; 