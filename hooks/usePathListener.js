import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function usePathListener(callback) {
  const location = useLocation();

  useEffect(() => {
    if (typeof callback === "function") callback(location.pathname);
    
  }, [location.pathname]);
}