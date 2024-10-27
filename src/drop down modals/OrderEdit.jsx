import { useContext, useEffect, useState } from 'react'
import CrmContext from '../crm context/CrmContext'
import { useSearchParams, useParams, useNavigate } from 'react-router-dom'
import { getDocument, submitUpdatedDocument } from '../crm context/CrmAction'
import {
  getCollection,
  getOrdersAfterEdit,
  updateCustomerStats,
} from '../crm context/CrmAction'
import { getPointsEarned1, getRating } from '../CrmFunctions'

function OrderEdit() {
  const navigate = useNavigate()

  const params = useParams()
  // console.log(params);
  const { dispatch, ordersData } = useContext(CrmContext)
  const [searchParams, setSearchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    item: '',
    price: parseInt(0),
  })

  const { item, price } = formData

  const onMutate = (e) => {
    // thid makes everything come in as strings
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  // added outside the function so I can call this in the array dependencies and it fires off again
  const formItem = document.querySelector('#item')
  // sets the initial data in form before it is edited
  useEffect(() => {
    const fetchListing = async () => {
      const searchParamsId = searchParams.get('editItemId')
      const data = await getDocument(searchParamsId, 'orders')
      // console.log(data);
      //  because it's the exact same data key value pairs this works
      setFormData({ ...data })
      formItem.focus()
      // select all text
      formItem.select()
      console.log(formItem.value)
    }

    fetchListing()
  }, [formItem])

  // handle the initial submit
  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    const updatedFormData = {
      ...formData,
      edited: true,
      price: parseInt(price),
      editedAt: new Date().toLocaleString('en-GB'),
    }
    const id = searchParams.get('editItemId')

    try {
      await submitUpdatedDocument('orders', id, updatedFormData)
      console.log(updatedFormData)
      searchParams.delete('editItemId')
      setSearchParams(searchParams)

      const updatedData = await getOrdersAfterEdit('orders', params.uid)
      dispatch({ type: 'ORDERS', payload: updatedData })
      console.log(updatedData)

      // loop around all data and get fresh total
      const value = updatedData.reduce((value, acc) => {
        return value + parseInt(acc.data.price)
      }, 0)

      updateStats(value)
      console.log(value)

      dispatch({ type: 'SET_TOTAL_AMOUNT_SPENT', payload: value })
      dispatch({ type: 'TOGGLE_EDIT_PURCHASE', payload: false })
    } catch (error) {
      console.log(error)
    }
  }

  const handleCloseModal = () => {
    dispatch({ type: 'TOGGLE_EDIT_PURCHASE', payload: false })
    searchParams.delete('editItemId')
    setSearchParams(searchParams)
    // setSearchParams({});
  }

  async function updateStats(updatedValue) {
    const statsOBJ = await getDocument(params.uid, 'stats')

    let goldCustomer

    if (updatedValue <= 1000) {
      goldCustomer = false
    }

    if (updatedValue >= 1000) {
      goldCustomer = true
    }

    console.log(goldCustomer)

    const newPointsForOrder = getPointsEarned1(updatedValue)
    const rating = getRating(updatedValue)

    console.log(newPointsForOrder)

    console.log(statsOBJ)
    console.log(updatedValue)

    const updatedData = {
      ...statsOBJ,
      points: newPointsForOrder,
      goldCustomer,
      rating,
      amountSpent: updatedValue,
    }

    await updateCustomerStats('stats', params.uid, updatedData)

    console.log(updatedData)
  }

  return (
    <div className="order-edit-modal">
      <form className="">
        <input
          className="order-input order-input-edit"
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
          value={price}
          onChange={onMutate}
        />

        <button onClick={handleSubmitEdit} className="edit-button" type="submit">
          Update Order
        </button>
      </form>
      <button type="submit" onClick={handleCloseModal} className="close-update-order-btn">
        X
      </button>
    </div>
  )
}

export default OrderEdit
