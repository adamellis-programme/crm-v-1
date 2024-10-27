import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="page-container">
      <header className="header-container">
        <p className="dasboard-header">Mornong Adam</p>
        <div className="dashboard-container">
          <Link className="dash-btn">New cutomer</Link>
          <Link className="dash-btn">View all customers</Link>
        </div>
      </header>
        
      <div className="dashboard-grid-container grid grid-cols-1 md:grid-cols-2 gap-2 md:mt-5">
        <div className="dashboard-left"></div>
        <div className="dashboard-right"></div>
      </div>
    </div>
  );
}

export default Dashboard;
