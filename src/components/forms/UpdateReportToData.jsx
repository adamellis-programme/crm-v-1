import { useState, useEffect } from 'react'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase.config'
const handleChange = (e) => {
  console.log(e.target.value)
}

const UpdateReportToData = () => {
  useEffect(() => {
    const getData = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'))
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, ' => ', doc.data())
      })
    }
    return () => {}
  }, [])
  return (
    <form className="update-reports-to">
      <select className="reports-to-select" onChange={handleChange} name="" id="">
        <option value="choose">change reports to</option>
        <option value="choose">change reports to</option>
      </select>
    </form>
  )
}

export default UpdateReportToData
