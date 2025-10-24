import  { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Cookies from 'js-cookie';
import { useTheme } from '../contexts/ThemeContext';

export default function RootPage() {
  const { setIsAuthenticated, setRole } = useContext(AuthContext);
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const token = Cookies.get('access_token');
    const role = Cookies.get('role');

    if (token && role) {
      setIsAuthenticated(true);
      setRole(role);
      switch (role) {
        case 'system_admin':
          navigate('/homes/system-admin');
          break;
        case 'basetype_admin':
          navigate('/homes/basetype-admin');
          break;
        case 'hr_admin':
          navigate('/homes/hr-admin');
          break;
        case 'organization_admin':
          navigate('/homes/organization-admin');
          break;
        case 'organization_user':
          navigate('/homes/organization-user');
          break;
        case 'person_user':
          navigate('/homes/person-user');
          break;
        default:
          navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate, setIsAuthenticated, setRole]);

  return null;
}