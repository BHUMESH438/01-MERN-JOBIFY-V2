import { Link, useRouteError } from 'react-router-dom';
import img from '../assets/images/not-found.svg';
import Wrapper from '../assets/wrappers/ErrorPage';

const Error = () => {
  const error = useRouteError();
  console.log(error);
  if (error.status === 404) {
    return (
      <Wrapper>
        <div>
          <img src={img} alt='not found' />
          <h3> {error.status} : Ohh! page not found</h3>
          <p> {error.statusText} : we cant seem to find the page you are looking for.... </p>
          <Link to='/dashboard'>back to home</Link>
        </div>
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <div>
        <h3>something went wrong</h3>
        <h3>
          {error.status} : {error.statusText}
        </h3>
        <Link to='/dashboard'>back to home</Link>
      </div>
    </Wrapper>
  );
};
export default Error;
