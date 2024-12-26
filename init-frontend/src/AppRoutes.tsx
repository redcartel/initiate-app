import { Route, Routes } from 'react-router';
import { useEffect } from 'react';
import { useGameAndCharacter } from './hooks/useGameAndCharacter';
import InitHeader from './layout/InitHeader';
import InitFooter from './layout/InitFooter';
import InitMain from './layout/InitMain';
import InitWrap from './layout/InitWrap';
import InitInterface from './interface/InitInterface';

const AppRoutes = () => {
  const { gameId, characterId } = useGameAndCharacter();

  useEffect(() => {
    if (gameId && !window.location.pathname.includes(gameId)) {
      if (characterId && !window.location.pathname.includes(characterId)) {
        window.location.href = `/${gameId}/${characterId}`;
      }
      else {
        window.location.href = `/${gameId}`;
      }
    }
  }, [gameId, characterId]);

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