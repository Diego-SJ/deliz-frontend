import { Avatar, Button } from 'antd';
import DevicesWebp from '@/assets/webp/devices.webp';
import {
  DotChartOutlined,
  ReconciliationOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '@/routes/routes';
import MembershipPage from '../membership';
import LandingNavbar from './layout/navbar';
import Footer from './layout/footer';

const Home = () => {
  const navigate = useNavigate();

  const goToSignUp = () => {
    navigate(APP_ROUTES.AUTH.SIGN_UP.path);
  };

  return (
    <div className="min-h-[100dvh] max-h-[100dvh] w-full">
      <LandingNavbar />

      <div className="w-full flex items-center justify-center px-6 mb-20">
        <div className="w-full max-w-[80rem] text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-center mt-20 uppercase">
            Las <span className="text-primary">ventas</span> de ayer, La{' '}
            <span className="text-primary">estrategía</span> de hoy
          </h1>
          <p className="text-center text-lg mt-4 font-extralight mb-6">
            La plataforma de ventas perfecta para pequeños y medianos negocios
          </p>
          <div className="w-full flex gap-2 sm:gap-6 justify-center mb-10">
            <Button size="large" className="rounded-full" ghost type="primary">
              Solicita una demo
            </Button>
            <Button
              size="large"
              type="primary"
              className="rounded-full"
              onClick={goToSignUp}
            >
              Registrarse gratis
            </Button>
          </div>

          <img
            src={DevicesWebp}
            alt="devices"
            className="w-full sm:w-[400px] mx-auto md:w-[500px] drop-shadow-lg"
          />
        </div>
      </div>

      <div className="w-full bg-primary text-white text-center py-20">
        <div className="w-full max-w-[80rem] mx-auto h-full">
          <h1 className="text-3xl sm:text-4xl font-black text-center uppercase px-6">
            Ya no solo vendas, crece tu negocio
          </h1>
          <p className="text-center text-lg mt-4 font-extralight px-10">
            Con Posiffy podrás llevar el control de tus ventas, inventario,
            clientes y mucho más en un solo lugar
          </p>
        </div>
      </div>

      <div className="w-full bg-white text-black text-center py-8 pb-28">
        <div className="w-full mx-auto max-w-[900px] mb-10">
          <h1 className="text-2xl sm:text-4xl font-black text-center mt-20 uppercase px-4 sm:px-6">
            Te brindamos herramientas acorde a tus necesidades
          </h1>
          <p className="text-center text-lg mt-4 font-extralight mb-6 px-4 sm:px-6">
            Posiffy cuenta con herramientas que se adaptan a las necesidades de
            tu negocio
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-[900px] mx-auto gap-10 px-4">
          <div className="flex flex-col text-start bg-white shadow-md px-6 py-7 rounded-3xl">
            <Avatar
              shape="square"
              size={64}
              icon={<ReconciliationOutlined className="text-teal-600" />}
              className="bg-teal-600/10 !rounded-3xl"
            />
            <h3 className="text-xl font-semibold mt-4 mb-2">
              Control de inventario
            </h3>
            <p className="font-extralight">
              Lleva el control de tus productos, categorías y unidades de medida
            </p>
          </div>
          <div className="flex flex-col text-start bg-white shadow-md px-6 py-7 rounded-3xl">
            <Avatar
              shape="square"
              size={64}
              icon={<TeamOutlined className="text-pink-600" />}
              className="bg-pink-600/10 !rounded-3xl"
            />
            <h3 className="text-xl font-semibold mt-4 mb-2">
              Ventas y clientes
            </h3>
            <p className="font-extralight">
              Administra tus ventas, clientes y pedidos de forma sencilla
            </p>
          </div>
          <div className="flex flex-col text-start bg-white shadow-md px-6 py-7 rounded-3xl">
            <Avatar
              shape="square"
              size={64}
              icon={<DotChartOutlined className="text-indigo-600" />}
              className="bg-indigo-600/10 !rounded-3xl"
            />
            <h3 className="text-xl font-semibold mt-4 mb-2">
              Reportes y análisis
            </h3>
            <p className="font-extralight">
              Obtén reportes y análisis de tus ventas y productos
            </p>
          </div>
        </div>
      </div>

      <MembershipPage />

      <Footer />
    </div>
  );
};

export default Home;
