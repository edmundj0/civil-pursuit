'use strict';

import React          from 'react';
import superagent     from 'superagent';
import Component      from '../lib/app/component';
import Modal          from './util/modal';
import Form           from './util/form';
import Button         from './util/button';
import Submit         from './util/submit';
import ButtonGroup    from './util/button-group';
import Icon           from './util/icon';
import Link           from './util/link';
import Row            from './util/row';
import Column         from './util/column';
import EmailInput     from './util/email-input';
import Password       from './util/password';

class Login extends React.Component {
  constructor (props) {
    super(props);

    this.state = { validationError : null, successMessage : null };
  }

  login () {
    let email = React.findDOMNode(this.refs.email).value,
      password = React.findDOMNode(this.refs.password).value;

    superagent
      .post('/sign/in')
      .send({ email, password })
      .end((err, res) => {
        switch ( res.status ) {
          case 404:
            this.setState({ validationError : 'Wrong email' });
            break;

            case 401:
              this.setState({ validationError : 'Wrong password' });
              break;

            case 200:
              this.setState({ validationError : null, successMessage : 'Welcome back' });
              location.href = '/page/profile';
              break;

            default:
              this.setState({ validationError : 'Unknown error' });
              break;
        }

        // location.href = '/';
      });
  }

  signUp (e) {
    e.preventDefault();

    this.props.join();
  }

  loginWithFacebook () {
    location.href = '/sign/facebook';
  }

  loginWithTwitter () {
    location.href = '/sign/twitter';
  }

  render () {
    let classes = [ 'syn-login' ];

    if ( this.props.show ) {
      classes.push('syn--visible');
    }

    return (
      <Modal className={ Component.classList(this, ...classes) } title="Login">
        <Form handler={ this.login.bind(this) } flash={ this.state } form-center>
          <ButtonGroup block>
            <Button primary onClick={ this.loginWithFacebook }>
              <Icon icon="facebook" />
              <span className={ Component.classList(this) } inline> Facebook</span>
            </Button>

            <Button info onClick={ this.loginWithTwitter }>
              <Icon icon="twitter" />
              <span> Twitter</span>
            </Button>
          </ButtonGroup>

          <div className="syn-form-group">
            <label>Email</label>
            <EmailInput block autoFocus required placeholder="Email" ref="email" />
          </div>

          <div className="syn-form-group">
            <label>Password</label>
            <Password block required placeholder="Password" ref="password" />
          </div>

          <div className="syn-form-group syn-form-submit">
            <Submit block>Login</Submit>
          </div>

          <Row>
            <Column span="50">
              Not yet a user? <a href="" onClick={ this.signUp.bind(this) }>Sign up</a>
            </Column>

            <Column span="50" text-right>
              Forgot password? <a href="">Click here</a>
            </Column>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Login;
