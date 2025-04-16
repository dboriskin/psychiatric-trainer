import type { NextPage } from 'next';
import App from '../components/App';

// Для проекта без маршрутизации, мы будем использовать SPA-подход
// Все переходы между экранами будут осуществляться через состояние, без использования роутера

const Home: NextPage = () => {
  return <App />;
};

export default Home;