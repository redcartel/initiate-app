import { Route, Routes } from 'react-router';
import InitHeader from './layout/InitHeader';
import InitFooter from './layout/InitFooter';
import InitMain from './layout/InitMain';
import InitWrap from './layout/InitWrap';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import EnterAdmin from './interface/EnterAdmin';
import GameList from './interface/GameList';
import GameSummary from './interface/GameSummary';
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
            < InitMain >
                <Routes>
                    <Route path="/:adminId" element={<GameList />} />
                    <Route path="/:adminId/:gameId" element={<GameSummary />} />
                    <Route path="*" element={<EnterAdmin />} />
                </Routes>
            </InitMain>
            < InitFooter />
        </InitWrap>
    )
}

export default AppRoutes