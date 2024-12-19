import { useEffect } from "react";
import { useLocation } from 'react-router-dom';

export function UseGenericTableURL(pageTableModel) {
  const location = useLocation();

  useEffect(() => {
    if (pageTableModel?.renderByURL) {
      pageTableModel.renderByURL(location);
    }
  }, [location, pageTableModel]);
}