import Wrapper from '../assets/wrappers/LandingPage';

import main from '../assets/images/main.svg';
import { Link } from 'react-router-dom';
import { Logo } from '../components';

function Landing() {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className='container page'>
        <div className='info'>
          <h1>
            Job <span>Tracking</span> App
          </h1>
          <p>This is a sipmle job tracking MERN web app project, made in react and express as framework for front end and backend and html,css,styled componenets for styling. For routing react router v6.4 aboove version used for clinet side routing which makes the app faster.mongo db atlas for efficient data storing.</p>
          <Link to='/register' className='btn register-link'>
            Register
          </Link>
          <Link to='/login' className='btn'>
            Login / Demo User
          </Link>
        </div>
        <img src={main} alt='job hunt' className='img main-img' />
      </div>
    </Wrapper>
  );
}

export default Landing;
