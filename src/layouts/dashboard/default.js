import { useEffect, memo, Fragment, useContext } from "react";
import { useLocation, Outlet, useNavigate } from "react-router-dom";

import { ShepherdTourContext } from "react-shepherd";
import Header from "../../components/partials/dashboard/HeaderStyle/header";
import SubHeader from "../../components/partials/dashboard/HeaderStyle/sub-header";
import Sidebar from "../../components/partials/dashboard/SidebarStyle/sidebar";
import Footer from "../../components/partials/dashboard/FooterStyle/footer";
import SettingOffCanvas from "../../components/setting/SettingOffCanvas";
import Loader from "../../components/Loader";
import * as SettingSelector from "../../store/setting/selectors";
import { useSelector } from "react-redux";
import { getCookie } from "../../utilities/getCookie";

const Tour = () => {
  const tour = useContext(ShepherdTourContext);
  const { pathname } = useLocation();
  useEffect(() => {
    if (
      pathname === "/dashboard" &&
      sessionStorage.getItem("tour") !== "true"
    ) {
      tour?.start();
    }
  });
  return <Fragment></Fragment>;
};

const Default = memo((props) => {
  const appName = useSelector(SettingSelector.app_name);
  const navigate = useNavigate();
  useEffect(() => {
    const token = getCookie("accessToken");

    if (!token) {
      navigate("/");
    }
  }, []);
  return (
    <Fragment>
      <Loader />
      <Sidebar app_name={appName} />
      <Tour />
      <main className="main-content page-wrapper mb-0">
        <div className="position-relative">
          <Header />
          <SubHeader />
        </div>
        {/* <div className="py-0 conatiner-fluid mt-n5"> */}
        <div>
          {/* <DefaultRouter /> */}
          <Outlet />
        </div>
        {/* <Footer /> */}
      </main>
      <SettingOffCanvas />
    </Fragment>
  );
});

Default.displayName = "Default";
export default Default;
