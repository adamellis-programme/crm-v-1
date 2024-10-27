import { useEffect, useContext, useState } from 'react'
import {
  getAllCustomersForProfilePageCompanyStats,
  calculateCompanyTotals,
  sumByCompany,
} from '../crm context/CrmAction'
function DisplayCompanySumUp() {
  const [companyStats, setcompanyStats] = useState(null)
  useEffect(() => {
    const getCompanyStats = async () => {
      const userData = await getAllCustomersForProfilePageCompanyStats('stats')
      const data = sumByCompany(userData)

      setcompanyStats(data)
    }
    getCompanyStats()
  }, [])

  // console.log(companyStats);

  const sortedArray =
    companyStats &&
    companyStats
      .sort((a, b) => {
        return b.amount - a.amount
      })
      .slice(0, 3)
  console.log(sortedArray)

  // MAYBE USE A BATCH FUNCTION
  // TO UPDATE THE DATA IN ALL AREAS

  if (sortedArray && sortedArray.length === 0) {
    return (
      <div className="profile-no-data-container stats-no-data">
        <p>no data to show yet</p>
      </div>
    )
  }
console.log('object')
  return (
    <div className="profile-page-account-stats-container">
      <ul className="profile-stats-ul">
        {sortedArray &&
          sortedArray.map((item, index) => (
            <li key={index} className="profile-stats-li">
              <span>{item.company}</span>
              <span>£ {item.amount}</span>
              {console.log(item)}
            </li>
          ))}

        {/* <li className="profile-stats-li">
          <span>Microsoft</span>
          <span>£357,000</span>
        </li>
 
        <li className="profile-stats-li">
          <span>Apple</span>
          <span>£457,000</span>
        </li> */}
      </ul>
    </div>
  )
}

export default DisplayCompanySumUp
