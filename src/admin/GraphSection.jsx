import React from 'react';
import NavSideBar from '../components/NavSideBar';

function GraphSection({ role }) {
  return (
    <NavSideBar role={role}>
      <div className="p-4 text-xl font-bold">Welcome to Graph Section!</div>
    </NavSideBar>
  );
}

export default GraphSection;