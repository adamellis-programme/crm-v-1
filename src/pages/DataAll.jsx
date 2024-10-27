import { useEffect, useState } from 'react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase.config'
import DataAllItem from '../components/DataAllItem'
import { useAuthStatusTwo } from '../hooks/useAuthStatusTwo'

// debug ** add loading state
const DataAll = () => {
  const { loggedInUser, claims } = useAuthStatusTwo()
  const [customers, setCustomers] = useState(null)
  const [loading, setLoading] = useState(true)
  console.log(loggedInUser)

  useEffect(() => {
    const getData = async () => {
      if (!loggedInUser || !loggedInUser.uid) {
        setLoading(false) // Ensure loading state is turned off if there's no loggedInUser
        return
      } 

      try {
        const data = []
        const q = query(
          collection(db, 'customers'),
          // only get data that belongs to manager of agent
          where('reportsTo.id', '==', loggedInUser.uid)
        )

        const querySnapshot = await getDocs(q)
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, ' => ', doc.data())
          data.push({ data: doc.data(), id: doc.id })
        })
        setCustomers(data) // Set state after processing all documents
      } catch (error) {
        console.error('Error fetching data: ', error)
      } finally {
        setLoading(false)
      }
    }

    getData()
  }, [loggedInUser]) // Only run when loggedInUser changes

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="page-container all-data-page-container">
      <section className="all-data-section-top">
        <p className="all-data-header-p">managers page all data</p>
      </section>

      <section className="all-data-section">
        <div className="data-header">
          <div className="data-header-div">ID</div>
          <div className="data-header-div">img</div>
          <div className="data-header-div">name</div>
          <div className="data-header-div">email</div>
          <div className="data-header-div">company</div>
          <div className="data-header-div">phone</div>
          <div className="data-header-div">reg</div>
          <div className="data-header-div">owner</div>
          <div className="data-header-div">rep to</div>
          {/* <div className="data-header-div">more</div> */}
        </div>

        {customers &&
          customers.map((customer, i) => (
            <DataAllItem
              key={customer.id}
              customer={customer}
              i={i}
              loggedInUser={loggedInUser}
            />
          ))}
      </section>
    </div>
  )
}

export default DataAll
