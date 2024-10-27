import { useState, useEffect, useConext } from 'react';

function MainDataTest() {
  return (
    <div className="page-container data-page-container">
      <div className="main-data-container">
        <table>
          <thead>
            <tr className="data-table-head-row">
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
              <th>Sign Up Agent</th>
              <th>dateOfSignUp</th>
              <th>Owner</th>
              <th>options</th>
            </tr>
          </thead>
          <tbody>
            <tr className="data-table-row">
              <td>29</td>
              <td>Louise Ellis Smith</td>
              <td>Louise@gapseekers.com</td>
              <td>gapseekers</td>
              <td>Fiona Louise</td>
              <td>02/11/2023, 15:18:43</td>
              <td>Eliza Louise Smith</td>
              <td>
                <button className="more-data-info-button">More Info</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MainDataTest;
