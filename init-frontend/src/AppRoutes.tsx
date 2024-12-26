import { Route, Routes } from 'react-router';
import InitHeader from './layout/InitHeader';
import InitFooter from './layout/InitFooter';
import InitMain from './layout/InitMain';
import InitWrap from './layout/InitWrap';
import InitInterface from './interface/InitInterface';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === '/') {
      if (window.localStorage.getItem('gameId') && window.localStorage.getItem('characterId')) {
        navigate(`/${window.localStorage.getItem('gameId')}/${window.localStorage.getItem('characterId')}`);
      }
      else if (window.localStorage.getItem('gameId')) {
        navigate(`/${window.localStorage.getItem('gameId')}`);
      }
    }
  }, []);

  return (
    <InitWrap>
      <InitHeader />
      <InitMain>
        <Routes>
          <Route path='/:gameId/:characterId' element={<InitInterface />} />
          <Route path='/:gameId' element={<InitInterface />} />
          <Route path='*' element={<InitInterface />} />
        </Routes>
      </InitMain>
      <InitFooter />
    </InitWrap>
  )
}

export default AppRoutes