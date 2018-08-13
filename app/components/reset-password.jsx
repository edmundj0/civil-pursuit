'use strict';

import React                        from 'react';
import ReactDOM                     from 'react-dom';
import Form                         from './util/form';
import EmailInput                   from './util/email-input';
import TextInput                    from './util/text-input';
import Password                     from './util/password';
import Panel                        from './panel';
import Loading                      from './util/loading';
import Button                       from './util/button'
import InputGroup                   from './util/input-group';
import Login                        from './login';
import userType                     from '../lib/proptypes/user';

class ResetPassword extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    userToReset : userType,
    urlParams : React.PropTypes.shape({
      token : React.PropTypes.string
    })
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  constructor (props) {
    super(props);

    this.state = {
      validationError   : (this.props.activation_token && this.props.activation_token === this.props.activation_key) ? null : "Reset Key Not Valid",
      successMessage    : null,
      info              : null
    };

    console.info("reset-password constructor");
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  save () {
    const password            =   ReactDOM.findDOMNode(this.refs.password);
    const confirmPassword     =   ReactDOM.findDOMNode(this.refs.confirmPassword);
    const resetKey            =   ReactDOM.findDOMNode(this.refs.reset);
    console.info("reset-password save");
    this.setState({ validationError : null });

    if ( password.value !== confirmPassword.value ) {
      this.setState({ validationError : 'Passwords don\'t match' });
      return;
    }

    if ( resetKey.value !== this.props.activation_key ) {
      this.setState({ validationError : 'Wrong reset key' });
      return;
    }

    this.setState({info: 'Resetting your password'}, ()=>{
      window.socket.emit('reset password', this.props.activation_key, resetKey.value, password.value, (result)=>{
        this.setState({ validationError : null, info: null, successMessage : 'Welcome back' }, ()=>{
          setTimeout(() => location.href = this.props.return_to || '/page/profile', 800);
        });
      })
    })
    
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    console.info("reset-password render");
    let content = ( <div style={{textAlign: 'center', padding: '1em 0', fontSize: "200%", color: "red"}}>Oops! Invalid key. Try sending a new forgot password email.</div> );

    const {activation_token}=this.props;

    if ( this.props.user ) {
      if(!this.props.user.email) // no user info
        return (
          <Panel title="Reset Password">
            <span>Missing email</span>
          </Panel>
        );
      let formContents;

      if ( ! this.state.info && ! this.state.successMessage ) {
        formContents = (
          <div style={{maxWidth: "30em", margin: 'auto'}}>
            <h3 className="text-center">Your email</h3>

            <EmailInput
              block
              autoFocus
              required
              medium
              disabled
              placeholder                 =   "Email"
              ref                         =   "email"
              name                        =   "email"
              value                       =   { this.props.user.email }
            />

            <h3 className="text-center">Your reset key</h3>

            <h5 className="text-center">Enter here the reset key that was sent to you by email</h5>

            <TextInput
              block
              medium
              required
              ref                         =   "reset"
              name                        =   "reset"
              defaultValue                = {activation_token}
              placeholder                 =   "Your reset key"
            />

            <h3 className="text-center">Enter a new password</h3>

            <InputGroup block>
              <Password
                required
                medium
                placeholder               =   "Password"
                ref                       =   "password"
                name                      =   "password"
              />
              <Password
                required
                medium
                placeholder               =   "Confirm password"
                ref                       =   "confirmPassword"
                name                      =   "confirm-password"
              />
            </InputGroup>

            <Button radius block medium primary style={{ marginTop : '10px' }} type="submit">Save new password</Button>
          </div>
        );
      }

      content = (
        <Form
          form-center
          style                       =   {{ margin : '10px' }}
          flash                       =   { this.state }
          handler                     =   { this.save.bind(this) }
          name                        =   "reset-password"
        >
          { formContents }
        </Form>
      );
    }

    return (
      <Panel title="Reset password">
        { content }
      </Panel>
    );
  }
}

export default ResetPassword;
