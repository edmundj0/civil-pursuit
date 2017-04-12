'use strict';

import React                          from 'react';
import Component                      from '../lib/app/component';
import CloudinaryImage                from './util/cloudinary-image';
import Button                         from './util/button';
import Icon                           from './util/icon';
import Login                          from './login';
import Join                           from './join';
import ForgotPassword                 from './forgot-password';
import userType                       from '../lib/proptypes/user';
import HeaderMenu                     from './header-menu';
import selectors                      from '../../selectors.json';
import menus                          from '../../fixtures/header-menu/1.json';

class TopBar extends React.Component {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  static propTypes = {
    user        :   userType,
    online      :   React.PropTypes.number
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  state = {
    showLogin           :   false,
    showJoin            :   false,
    showForgotPassword  :   false
  };

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggleLogin (e) {
    if ( e ) {
      e.preventDefault();
    }

    let modalJoin = document.querySelector('.syn-join');
    let modalLogin = document.querySelector('.syn-login');
    let modalForgotP = document.querySelector('.syn-forgot-password');

    modalJoin.classList.remove('syn--visible');

    modalLogin.classList.toggle('syn--visible');

    modalForgotP.classList.remove('syn--visible');


  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggleJoin (e) {
    if ( e ) {
      e.preventDefault();
    }


    let modalJoin = document.querySelector('.syn-join');
    let modalLogin = document.querySelector('.syn-login');
    let modalForgotP = document.querySelector('.syn-forgot-password');

    modalJoin.classList.toggle('syn--visible');

    modalLogin.classList.remove('syn--visible');

    modalForgotP.classList.remove('syn--visible');

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  toggleForgotPassword (e) {
    if ( e ) {
      e.preventDefault();
    }

    let modalJoin = document.querySelector('.syn-join');
    let modalLogin = document.querySelector('.syn-login');
    let modalForgotP = document.querySelector('.syn-forgot-password');

    modalJoin.classList.remove('syn--visible');

    modalLogin.classList.remove('syn--visible');

    modalForgotP.classList.toggle('syn--visible');

  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  signOut () {
    window.onbeforeunload=null; // stop the popup about navigating away
    location.href = '/sign/out';
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  goToPage (p) {
    //location.href = '/page/profile';
    this.props.setPath(p);
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  goToHref (link) {
    location.href = link;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  headerMenuHandler (e) {
    e.preventDefault();

    this.HeaderMenuToggle().then(
      () => {
        const hamburger = this.refs.hamburger;
        hamburger.classList.toggle('on');
      }
    );
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  HeaderMenuToggle () {
    return new Promise((ok, ko) => {
      const headerMenu = document.querySelector('#syn-header-menu');

      headerMenu.classList.toggle('visible');

      if ( headerMenu.classList.contains('visible') ) {
        const headerHeight = headerMenu.offsetHeight;

        const bottom = `calc(100vh - ${(78 + headerHeight)}px)`;


        headerMenu.style.bottom = bottom;
      }

      else {
        headerMenu.style.bottom = 'calc(100vh - 73px)';
      }

      setTimeout(ok);
    });
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  render () {
    let { user, ready } = this.props;

    let comp = 'syn-top_bar';

    let onlineNow = this.props.online || 0;

    let right1, right2, menu1, menu2;

    // if ( ready ) {
      if ( user ) {
        right1 = (
            <div className="syn-top_bar-menu-item" key={ `header-menu-profile-button` } >
              <button onClick={ this.goToPage.bind(this, '/page/profile') }>
                <span>Profile</span>
              </button>
            </div>
        );
        right2 = (
            <div className="syn-top_bar-menu-item">
              <button onClick={ this.signOut.bind(this) }>
                <span>Logout</span>
              </button>
            </div>
        );
        menu1 = (
          <li key={ `header-menu-profile-button` }>
            <button onClick={this.goToPage.bind(this, '/page/profile') }>
              <span>Profile</span>
            </button>
          </li>
        );
        menu2 = (
          <li key={ `header-menu-signout-button` }>
            <button onClick={this.signOut.bind(this) }>
              <span>Logout</span>
            </button>
          </li>
        );
      }
      else {
        right1 = (
            <div className="syn-top_bar-menu-item">
              <button onClick={ this.toggleLogin.bind(this) }>
                <span>Login</span>
              </button>
            </div>
        );
        right2 = (
            <div className="syn-top_bar-menu-item">
              <button onClick={ this.toggleJoin.bind(this) }>
                <span>Join</span>
              </button>
            </div>
        );
        menu1 = (
          <li key={ `header-menu-login-button` }>
            <button onClick={this.toggleLogin.bind(this) }>
              <span>Login</span>
            </button>
          </li>
        );
        menu2 = (
          <li key={ `header-menu-join-button` }>
            <button onClick={this.toggleJoin.bind(this) }>
              <span>Join</span>
            </button>
          </li>
        );
      }
  
    // }

    let menustrip = [];

    menustrip.push(
      <div className="syn-top_bar-menu-item">
        <button onClick={this.goToPage.bind(this, '/')} >
          <span>Challenges</span>
        </button>
      </div>
      );

    menustrip.push(
      <div className="syn-top_bar-menu-item" >
        <button onClick={this.goToPage.bind(this, '/about')} >
          <a href='/about' onClick={this.goToPage.bind(this, '/about')}>About</a>
        </button>
      </div>
      );

    menustrip.push(
      <div className="syn-top_bar-menu-item" >
        <button onClick={this.goToHref.bind(this, "https://synaccord.wordpress.com/")} >
          <span>Blog</span>
        </button>
      </div>
      );


    menustrip.push(right1);
    menustrip.push(right2);

    let menuViews = [];

    menuViews.push(
      <li>
        <a href={ '/' } onClick={this.goToPage.bind(this, '/')} >
          <span>Challenges</span>
        </a>
      </li>
      );

    menuViews.push(
      <li>
        <a href={ '/about' } onClick={this.goToPage.bind(this, '/about')} >
          <span>About</span>
        </a>
      </li>
      );

    menuViews.push(
      <li>
        <a href={'https://synaccord.wordpress.com/'} onClick={this.goToHref.bind(this, 'https://synaccord.wordpress.com/')} >
          <span>Blog</span>
        </a>
      </li>
      );

    menuViews.push(menu1);
    menuViews.push(menu2);


    return (
      <section>
        <header role="banner" className="syn-top_bar-wrapper">
          <div className="syn-top_bar-wrapper-inner">
            <section className= "syn-top_bar">
              <section className= "syn-top_bar-info">
                <section className={ `${comp}-left` }>
                  <section className={ `${comp}-image` }>
                      <a href="/">
                        <CloudinaryImage id="Synaccord_logo_64x61_znpxlc.png" transparent/>
                      </a>
                  </section>
                  <section className={ `${comp}-logo` }><p>Civil Pursuit<sub>TM</sub></p></section>
                </section>
                <section className={ `${comp}-right` }>
                  <section className={ `${comp}-beta` }>Beta</section>
                  <section className={ 'syn-top_bar-hamburger'} ref="hamburger">
                    <Button onClick={ this.headerMenuHandler.bind(this) }>
                      <Icon icon="bars" />
                    </Button>
                  </section>
                </section>
              </section>
            </section>
            <section className="syn-top_bar-menu-row">
              { menustrip }
            </section>
          </div>
        </header>

        <Login show={ this.state.showLogin } join={ this.toggleJoin.bind(this) } forgot-password={ this.toggleForgotPassword.bind(this) } />
        <Join show={ this.state.showJoin } login={ this.toggleLogin.bind(this) } />
        <ForgotPassword show={ this.state.showForgotPassword } login={ this.toggleLogin.bind(this) } join={ this.toggleJoin.bind(this) } />
        <section id="syn-header-menu" ref="header-menu">
          <ul>
           { menuViews }
          </ul>
        </section>
      </section>
    );
  }
}

// moved this out of render - return because I couldn't comment it out.
//              <section className={ Component.classList(this, `${comp}-online_now`, 'syn-screen-phone_and_up') }>
//                Online now: { onlineNow }
//              </section>
export default TopBar;
