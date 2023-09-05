import Wrapper from '../assets/wrappers/BigSidebar';
import { useDashboardContext } from '../pages/DashboardLayout';
import NavLinks from './NavLinks';
import Logo from './logo';

const BigSidebar = () => {
  const { showSidebar } = useDashboardContext();
  // console.log(showSidebar, 'showsidebar big component');
  return (
    <Wrapper>
      <div className={showSidebar ? 'sidebar-container' : '.sidebar-container show-sidebar'}>
        <div className='content'>
          <header>
            <Logo />
          </header>
          <NavLinks isBigSidebar />
        </div>
      </div>
    </Wrapper>
  );
};
export default BigSidebar;
