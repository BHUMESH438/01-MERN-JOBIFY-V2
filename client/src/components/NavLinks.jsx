import { useDashboardContext } from '../pages/DashboardLayout';
import links from '../utils/links';
import { NavLink } from 'react-router-dom';

const NavLinks = ({ isBigSidebar }) => {
  //getting the role and togglesidebar from the dashboard
  const { user, toggleSidebar } = useDashboardContext();
  return (
    <div className='nav-links'>
      {links.map(link => {
        //listing the icon form the dshboard
        const { text, path, icon } = link;
        const { role } = user;
        //hiding the nav icon and element for non admin users
        if (role !== 'admin' && path === 'admin') return;
        return (
          <NavLink to={path} key={text} className='nav-link' onClick={isBigSidebar ? null : toggleSidebar} end>
            <span className='icon'>{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};
export default NavLinks;
