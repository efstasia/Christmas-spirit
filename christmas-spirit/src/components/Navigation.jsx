import React from "react";
import { Routes, Route, Link } from "react-router-dom";

export const Navigation = () => {

  return (
    <div className="navigation">
      <nav >
          <Link to="/">Spirit</Link>
          <Link to="/presents">Presenter</Link>
      </nav>
    </div>
  )
}
