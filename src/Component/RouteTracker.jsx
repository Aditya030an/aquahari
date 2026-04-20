import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { pageView } from "../utils/analytics";

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname + location.search;
    pageView(path);
  }, [location]);

  return null;
};

export default RouteTracker;