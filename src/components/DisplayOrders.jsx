import { useEffect, useState, useContext } from 'react'
import { useSearchParams, useHistory } from 'react-router-dom'
import { ReactComponent as EditIcon } from '../icons/edit-icon.svg'

import { useParams, Link, useNavigate, useLocation } from 'react-router-dom'
import CrmContext from '../crm context/CrmContext'
import {
  getCollection,
  getCustomer,
  newDataBaseEntry,
  getStatsObjToEdit,
  getSingleDoc,
  updateCustomerStats,
  testUpdate,
  getDocument,
} from '../crm context/CrmAction'
import { getDoc, doc, startAfter, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { getPointsEarned1, getCustomerRating, getRating } from '../CrmFunctions'
import { db } from '../firebase.config'
import { getAuth } from 'firebase/auth'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import DataSvgIcon from './DataSvgIcon'

// const {history} = useHistory();

function DisplayOrders() {
  const auth = getAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const searchParamsTest = new URLSearchParams()

  const [searchParams, setSearchParams] = useSearchParams()

  const { dispatch, totalAmountSpent, editPurchase, ordersData, customerStats } =
    useContext(CrmContext)

  // const [orders, setOrders] = useState(null);
  const [customerId, setcustomerId] = useState(null)
  const [initCustId, setInitCustId] = useState('')
  const [formData, setFormData] = useState({
    item: '',
    price: '',
  })

  const params = useParams()
  // console.log(params);
  const { price, item } = formData

  // get and set the custId to get and match the stats unique stats data
  // THIS IS WHER THE ORIG CUST ID STARTS FROM ADAM-123
  useEffect(() => {
    const getSingleCustomerData = async () => {
      try {
        const custInfo = await getSingleDoc('customers', params.uid)
        const statsInfo = await getSingleDoc('stats', params.uid)
        dispatch({ type: 'SET_STATS', payload: statsInfo })

        console.log(statsInfo)
        // console.log(custInfo)

        setInitCustId(custInfo.custId)
      } catch (error) {
        console.log(error)
      }
    }

    getSingleCustomerData()
  }, [])
  // get orders
  useEffect(() => {
    try {
      const getDbData = async () => {
        const data = await getCollection('orders', params.uid)
        dispatch({ type: 'ORDERS', payload: data })
        dispatch({ type: 'ORDERS_LENGTH', payload: data.length })
      }
      getDbData()
    } catch (error) {
      console.log(error)
    }
  }, [initCustId])

  // 1: make request for the updated array and ID
  // 2: make new stats object
  // 3: make request to update araay using the ID frompm previous request
  // 4: on delete and on edit make reqest to update
  const onDelete = async (id) => {
    try {
      // Filter out the order to be deleted
      const updatedData = ordersData.filter((item) => item.id !== id)
      const deletedItem = ordersData.find((item) => item.id === id)

      // Get the price of the deleted order
      const deletedPrice = deletedItem.data.price

      // Dispatch to update the UI
      dispatch({ type: 'ORDERS', payload: updatedData })

      // Update the total amount spent
      const newTotalAmountSpent = updatedData.reduce((value, item) => {
        return value + parseInt(item.data.price)
      }, 0)

      let goldCustomer

      if (newTotalAmountSpent <= 1000) {
        goldCustomer = false
      }

      // Dispatch to update the total amount spent and the number of orders
      dispatch({ type: 'SET_TOTAL_AMOUNT_SPENT', payload: newTotalAmountSpent })
      dispatch({ type: 'ORDERS_LENGTH', payload: updatedData.length })

      // Get the current stats object
      const statsOBJ = await getDocument(initCustId, 'stats')

      // Calculate the new total points after deleting the order
      const newPointsForOrder = getPointsEarned1(statsOBJ.amountSpent - deletedPrice)
      const currentPointsForOrder = getPointsEarned1(statsOBJ.amountSpent)

      const rating = getRating(statsOBJ.amountSpent - deletedPrice)
      console.log(rating)
      // Update the stats object
      const updatedStats = {
        ...statsOBJ,
        amountSpent: statsOBJ.amountSpent - deletedPrice,
        points: statsOBJ.points - (currentPointsForOrder - newPointsForOrder),
        numberOfOrders: statsOBJ.numberOfOrders - 1,
        rating,
        goldCustomer,
      }

      // Update the stats object in the database
      await updateCustomerStats('stats', initCustId, updatedStats)

      // Delete the actual order document from the database
      await deleteDoc(doc(db, 'orders', id))

      toast.success('Order deleted successfully')
    } catch (error) {
      console.error('Error deleting order: ', error)
      toast.error('Failed to delete order')
    }
  }

  const openModal = () => {
    if (editPurchase === false) {
      dispatch({ type: 'TOGGLE_EDIT_PURCHASE', payload: true })
    }
  }

  const onEdit = (id) => {
    openModal()
    setSearchParams((prev) => {
      prev.set('editItemId', id)
      return prev
    })

    // function to get exact item can be called here and made in the action file
    // the returned data has to be dispatched from here to the context and then fed back into the order edit
  }

  const onMutate = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (item === '' || price === '') {
      toast.error('please enter a item and price!')
      return
    }

    try {
      const newOrder = {
        ...formData,
        price: parseInt(price), //+= on to obj stats
        customerUid: params.uid,
        timestamp: serverTimestamp(),
        edited: false,
        agentId: params.agentUid,
        dateOfOrder: new Date().toLocaleString('en-GB'),
        customerName: params.name,
        customerEmail: searchParams.get('email'),
        pointsForOrder: getPointsEarned1(parseInt(price), 0),
      }

      const data = await newDataBaseEntry('orders', newOrder, params.uid)

      const fetchOrdersWithNewOrder = await getCollection('orders', params.uid)
      // this getStatsObj has been grabbed just to get the UID index to update the document with
      const getStatsObj = await getStatsObjToEdit('stats', initCustId)
      // console.log(initCustId)

      const statsID = getStatsObj[0].id
      // console.log(fetchOrdersWithNewOrder)
      // console.log(getStatsObj)

      let sum = totalAmountSpent + parseInt(price)
      console.log(sum)
      let points = 0
      let goldCustomer = false
      let rating = 0

      if (sum >= 1000) {
        goldCustomer = true
      }

      console.log(goldCustomer)
      const totalPoints = getPointsEarned1(sum, points)
      const ratingAmount = getCustomerRating(sum, rating)

      const updatedStats = {
        ...getStatsObj[0].data,
        numberOfOrders: fetchOrdersWithNewOrder.length,
        amountSpent: totalAmountSpent + parseInt(price),
        points: totalPoints,
        goldCustomer,
        rating: ratingAmount,
        // messages: [],
      }
      // SUM UP BATCH UPDATES ...

      dispatch({ type: 'ORDERS', payload: data })
      dispatch({
        type: 'SET_TOTAL_AMOUNT_SPENT',
        payload: totalAmountSpent + parseInt(formData.price),
      })
      dispatch({ type: 'ORDERS_LENGTH', payload: data.length })

      const sendUpdatedStatsData = updateCustomerStats('stats', statsID, updatedStats)
      const getUpdStatsObj = await getStatsObjToEdit('stats', initCustId)
      console.log(getUpdStatsObj)

      dispatch({ type: 'SET_STATS', payload: getUpdStatsObj[0].data })

      setFormData({
        item: '',
        price: '',
      })
    } catch (error) {
      console.log(error)
    }
  }
  console.log(customerStats)

  if (!ordersData) {
    return <h1>Loading ... </h1>
  }

  function updateStats(params) {}

  return (
    <div>
      <div className="form-container">
        <form onSubmit={onSubmit} className="">
          <input
            className="order-input "
            type="text"
            id="item"
            placeholder="Enter Item"
            onChange={onMutate}
            value={item}
          />
          <input
            className="order-input"
            type="number"
            id="price"
            placeholder="Enter Price"
            onChange={onMutate}
            value={price}
          />

          <button className="booking-button" type="submit">
            Place Order
          </button>
        </form>
      </div>

      <div className="order-display-div">
        <ul>
          {ordersData &&
            ordersData.map((item) => (
              <li key={item.id} className="order-item">
                <div className="order-item-top">
                  <div className="order-item-div"> {item.data.item}</div>
                  <div className="order-item-div"> £ {item.data.price}</div>
                  <div className="order-item-div order-item-booked-by">
                    {' '}
                    <span>{auth.currentUser.displayName}</span>{' '}
                    <span> {item.data.dateOfOrder}</span>
                  </div>
                </div>

                <div className="order-btn-container">
                  <button onClick={() => onEdit(item.id)}>
                    <EditIcon className="order-edit" />
                  </button>
                  <button onClick={() => onDelete(item.id)} className="order-delete">
                    X
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>

      {ordersData.length < 3 && <DataSvgIcon />}
    </div>
  )
}

export default DisplayOrders
