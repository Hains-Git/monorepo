import React from "react";
import { UseRegisterKey } from '../../hooks/use-register';

function Loader({ pageTableModel }) {
  const loading = pageTableModel.loading;

  UseRegisterKey("loader", pageTableModel.push, pageTableModel.pull);

  return (
    loading
      ? (
        <div className="load-wrapper">
          <div className="loading-spinner" />
        </div>
      )
      : null
  );
}

export default Loader;
