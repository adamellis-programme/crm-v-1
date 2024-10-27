import { useEffect } from 'react'
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../../firebase.config'

const Test = () => {
  useEffect(() => {
    const data = async () => {
      try {
        const oldId = 'pt0vhuPOkVZEl2YDuNMhIObtasp2' // Replace with your actual oldId
        const newId = '111' // Replace with your actual newId

        // Get a reference to the "customers" collection
        const customersRef = collection(db, 'customers')

        // Create a query to find all customers where reportsTo.id equals oldId
        const q = query(customersRef, where('repReportsTo.id', '==', oldId))

        // Execute the query
        const querySnapshot = await getDocs(q)
        console.log(
          'Documents to be updated:',
          querySnapshot.docs.map((doc) => doc.data())
        )

        // Get a new write batch
        const batch = writeBatch(db)

        // Loop through the documents and update the reportsTo.id field
        querySnapshot.forEach((doc) => {
          const customerRef = doc.ref
          batch.update(customerRef, { 'repReportsTo.id': newId })
        })

        // Commit the batch
        await batch.commit()
        console.log('Batch update committed successfully')
      } catch (error) {
        console.error('Error updating documents:', error)
      }
    }

    // JOB FOR TOMORROW
    // GO OVER DOCS CODE AND CROSS REFERENCE THIS
    // CODE SO THAT IT IS EASY TO READ THE DOCS
    // IN THE FUTURE
    // LEARN WHERE TO PLACE THE LOOPS THAT ARE NOT SHOWN
    data()

    return () => {}
  }, [])

  return <div>Test</div>
}

export default Test
