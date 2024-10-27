import {
  collection,
  addDoc,
  setDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  deleteDoc,
} from 'firebase/firestore'
// fireStore is the no sql database
// "firebase/auth"; is for the autentication
import { db } from '../firebase.config'

export async function getCustomersForMainDataPage(collectionName, params) {
  try {
    //  get a reference
    const usersReference = collection(db, collectionName)

    // create a query for firebase
    const q = query(
      usersReference,
      where('agentUid', '==', params),
      orderBy('timestamp', 'desc')
      // limit(10)
    )

    // execute query
    const querySnap = await getDocs(q)

    const data = []

    querySnap.forEach((doc) => {
      return data.push({
        id: doc.id,
        data: doc.data(),
      })
    })

    console.log(data)
    return data
  } catch (error) {
    console.log(error)
    // toast.error('could not fetch data');
  }
}

// used in pages:
// keep functions distinct
export async function getOrdersAfterEdit(collectionName, params) {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(
      collectionRef,
      where('customerUid', '==', params),
      orderBy('price', 'desc'),
      limit(10)
    )

    const querySnap = await getDocs(q)

    const users = []
    querySnap.forEach((doc) => {
      // console.log(doc.data());
      return users.push({
        id: doc.id,
        data: doc.data(),
      })
    })
    // console.log(users);
    return users
  } catch (error) {
    console.log(error)
  }
}

export async function getCollection(collectionName, params) {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(
      collectionRef,
      where('customerUid', '==', params),
      orderBy('price', 'desc'),
      limit(10)
    )

    const querySnap = await getDocs(q)

    const users = []
    querySnap.forEach((doc) => {
      // console.log(doc.data());
      return users.push({
        id: doc.id,
        data: doc.data(),
      })
    })
    // console.log(users);
    return users
  } catch (error) {
    console.log(error)
  }
}

// used on orders page to get specific user
export async function getCustomer(collectionName, params) {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(
      collectionRef,
      where('custId', '==', params),
      orderBy('price', 'desc'),
      limit(10)
    )

    const querySnap = await getDocs(q)

    const users = []
    querySnap.forEach((doc) => {
      // console.log(doc.data());
      return users.push({
        id: doc.id,
        data: doc.data(),
      })
    })
    // console.log(users);
    return users
  } catch (error) {
    console.log(error)
  }
}

// used in pages: note Edit,
export async function getCollectionNotes(collectionName, params) {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(
      collectionRef,
      where('custId', '==', params),
      orderBy('noteDate', 'desc'),
      limit(10)
    )

    const querySnap = await getDocs(q)

    const users = []
    querySnap.forEach((doc) => {
      // console.log(doc.data());
      return users.push({
        id: doc.id,
        data: doc.data(),
      })
    })
    // console.log(users);
    return users
  } catch (error) {
    console.log(error)
  }
}

// this is getting a document
export async function getDocument(id, collectionName) {
  const docRef = doc(db, collectionName, id)
  const docSnap = await getDoc(docRef)
  const data = docSnap.data()

  if (docSnap.exists()) {
    return docSnap.data()
  } // else... toast.error()
}
// gets a single doc for the orders page initaly to grab the single customer obj
export async function getSingleDoc(collectionName, orderId) {
  const docRef = doc(db, collectionName, orderId)
  const docSnap = await getDoc(docRef)
  const data = docSnap.data()

  if (docSnap.exists()) {
    return docSnap.data()
  } // else... toast.error()
}

export async function submitUpdatedDocument(collectionName, orderId, formData) {
  const docRef = doc(db, collectionName, orderId)
  const data = await updateDoc(docRef, formData)
  // navigate to ... upstaed page
}

// this id for adding a new db entery so does not need a id as one id created on submit
export async function newDataBaseEntry(collectionName, newEntryObj, paramsUid) {
  const docRef = await addDoc(collection(db, collectionName), newEntryObj)
  const userReference = collection(db, collectionName)

  const q = query(
    userReference,
    where('customerUid', '==', paramsUid),
    orderBy('price', 'desc'),
    limit(10)
  )

  const querySnap = await getDocs(q)
  const data = []

  querySnap.forEach((item) => {
    data.push({
      id: item.id,
      data: item.data(),
    })
  })

  return data
}

export async function newNoteEntry(collectionName, newEntryObj, paramsUid) {
  const docRef = await addDoc(collection(db, collectionName), newEntryObj)
  const userReference = collection(db, collectionName)

  const q = query(
    userReference,
    where('custId', '==', paramsUid),
    orderBy('noteDate', 'desc'),
    limit(10)
  )

  const querySnap = await getDocs(q)
  const data = []

  querySnap.forEach((item) => {
    data.push({
      id: item.id,
      data: item.data(),
    })
  })

  return data
}
// used in pages: ProfileCOntrolButtons,
// updates the name and phone number on the personal details page
export async function onSubmit(id, name, phone) {
  console.log('click')
  const userRef = doc(db, 'customers', id)
  await updateDoc(userRef, {
    name,
    phone,
  })
}

// add task to the database
export async function addTaskToDatabase(collectionName, formData) {
  const docRef = await addDoc(collection(db, collectionName), formData)
}

// add email to email collection
export async function submitEmail(collectionName, formData) {
  const docRef = await addDoc(collection(db, collectionName), formData)
}

// get currentCustomer document for the email address and other info
// used in sendEmail.jsx to get email and place in form
export async function getCustomerInfoForEmail(collectionName, paramsId) {
  const docRef = doc(db, collectionName, paramsId)
  const docSnap = await getDoc(docRef)
  if (docSnap.exists()) {
    return docSnap.data()
  }
}

// fetch emails and display in the user profile
export async function getEmailsToDisplayInAgentProfile(collectionName, paramsId) {
  // get ref
  const emailRef = collection(db, collectionName)

  //  create a query
  const q = query(
    emailRef,
    where('agentId', '==', paramsId),
    orderBy('dateSent', 'desc'),
    limit(5)
  )

  // Execute Query - get the socs for this specific query
  const querySnap = await getDocs(q)

  const emails = []

  querySnap.forEach((doc) => {
    emails.push({
      id: doc.id,
      data: doc.data(),
    })
  })

  return emails
}

// fetch orders and display in the user profile
export async function getOrdersToDisplayInAgentProfile(collectionName, paramsId) {
  // get ref
  const ordersRef = collection(db, collectionName)

  //  create a query
  const q = query(
    ordersRef,
    where('agentId', '==', paramsId),
    // orderBy('dateOfOrder', 'desc'),
    limit(5)
  )

  // Execute Query - get the socs for this specific query
  const querySnap = await getDocs(q)

  const orders = []

  querySnap.forEach((doc) => {
    // console.log(doc.data())
    orders.push({
      id: doc.id,
      data: doc.data(),
    })
  })

  return orders
}

// fetch NOTES and display in the user profile
export async function getNotesToDisplayInAgentProfile(collectionName, paramsId) {
  // get ref
  const ordersRef = collection(db, collectionName)

  //  create a query
  const q = query(
    ordersRef,
    where('agentId', '==', paramsId),
    // orderBy('noteWrittenById', 'desc'),
    limit(5)
  )

  // Execute Query - get the socs for this specific query
  const querySnap = await getDocs(q)

  const orders = []

  querySnap.forEach((doc) => {
    // console.log(doc.data())
    orders.push({
      id: doc.id,
      data: doc.data(),
    })
  })

  return orders
}

// fetch TASKS and display in the user profile
export async function getTasksToDisplayInAgentProfile(collectionName, paramsId) {
  // get ref
  const tasksRef = collection(db, collectionName)

  //  create a query
  const q = query(
    tasksRef,
    where('agentId', '==', paramsId),
    orderBy('timeStamp', 'desc'),
    limit(5)
  )

  // Execute Query - get the socs for this specific query
  const querySnap = await getDocs(q)

  const tasks = []

  querySnap.forEach((doc) => {
    // console.log(doc.data())
    tasks.push({
      id: doc.id,
      data: doc.data(),
    })
  })

  return tasks
}

// this is getting single a document
export async function getTaskToToggleCompleted(taskId, collectionName) {
  const docRef = doc(db, collectionName, taskId)
  const docSnap = await getDoc(docRef)
  const data = docSnap.data()

  if (docSnap.exists()) {
    return docSnap.data()
  } // else... toast.error()
}

export async function updateTaskToCompleted(id, completed) {
  const userRef = doc(db, 'tasks', id)
  await updateDoc(userRef, {
    completed,
  })
}

export async function getStatsObjToEdit(collectionName, params) {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, where('custId', '==', params), limit(10))

    const querySnap = await getDocs(q)

    const users = []
    querySnap.forEach((doc) => {
      // console.log(doc.data());
      return users.push({
        id: doc.id,
        data: doc.data(),
      })
    })
    // console.log(users);
    return users
  } catch (error) {
    console.log(error)
  }
}

export async function updateCustomerStats(collectionName, custId, formData) {
  try {
    const docRef = doc(db, collectionName, custId)
    const data = await updateDoc(docRef, formData)
    return data
  } catch (error) {
    console.log(error)
  }
}

export async function getAndOrderStatsForStatsPage(collectionName, params) {
  try {
    const collectionRef = collection(db, collectionName)
    // const q = query(
    //   collectionRef,
    //   where('custId', '==', params),
    //   // orderBy('price', 'desc'),
    //   limit(10)
    // );

    const querySnap = await getDocs(collectionRef)

    const users = []
    querySnap.forEach((doc) => {
      // console.log(doc.data());
      return users.push({
        id: doc.id,
        data: doc.data(),
      })
    })
    // console.log(users);
    return users
  } catch (error) {
    console.log(error)
  }
}

export async function getStatsForStatsPage(collectionName, params) {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(
      collectionRef,
      where('custId', '==', params),
      // orderBy('price', 'desc'),
      limit(10)
    )

    const querySnap = await getDocs(q)

    const users = []
    querySnap.forEach((doc) => {
      // console.log(doc.data());
      return users.push({
        id: doc.id,
        data: doc.data(),
      })
    })
    // console.log(users);
    return users
  } catch (error) {
    console.log(error)
  }
}

// used on the admin page to add agent to the dataBase
export async function addAgentToDbFromAdmin(collectionName, uid, newEntryObj) {
  try {
    await setDoc(doc(db, collectionName, uid), newEntryObj)
  } catch (error) {
    console.log(error)
  }
}

export async function getListOfAgentsForAdminPage(collectionName) {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(
      collectionRef,
      orderBy('timestamp', 'desc')
      // limit(10)
    )

    const querySnap = await getDocs(q)

    const users = []
    querySnap.forEach((doc) => {
      // console.log(doc.data());
      return users.push({
        id: doc.id,
        data: doc.data(),
      })
    })
    // console.log(users)
    return users
  } catch (error) {
    console.log(error)
  }
}

export async function deleteAgent(collectionName, uid) {
  // can use a referance variable
  deleteDoc(doc(db, collectionName, uid))
}

export async function getAgentToDisplayChangeUpdateTaskLengthData(
  collectionName,
  params
) {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, where('agentUid', '==', params))

    const querySnap = await getDocs(q)

    const users = []
    querySnap.forEach((doc) => {
      // console.log(doc.data());
      return users.push({
        id: doc.id,
        data: doc.data(),
      })
    })
    // console.log(users);
    return users
  } catch (error) {
    console.log(error)
  }
}

export async function submitUpdatedTaskLength(collectionName, orderId, formData) {
  const docRef = doc(db, collectionName, orderId)
  const data = await updateDoc(docRef, formData)
  // navigate to ... upstaed page
}

export async function addMsgToDatabase(collectionName, formData) {
  const docRef = await addDoc(collection(db, collectionName), formData)
}

export async function getUsersForMessageModalInitialLoad(collectionName, params) {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(
      collectionRef
      // where('customerUid', '==', params),
    )

    const querySnap = await getDocs(q)

    const users = []
    querySnap.forEach((doc) => {
      // console.log(doc.data());
      return users.push({
        id: doc.id,
        data: doc.data(),
      })
    })
    // console.log(users);
    return users
  } catch (error) {
    console.log(error)
  }
}

export async function getUserForSendMessagePush(collectionName, params) {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, where('agentUid', '==', params))

    const querySnap = await getDocs(q)

    const users = []
    querySnap.forEach((doc) => {
      // console.log(doc.data());
      return users.push({
        id: doc.id,
        data: doc.data(),
      })
    })
    // console.log(users);
    return users
  } catch (error) {
    console.log(error)
  }
}

export async function getAgentForUpdatingMessagesArrayNumber(collectionName, params) {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, where('agentUid', '==', params))

    const querySnap = await getDocs(q)

    const users = []
    querySnap.forEach((doc) => {
      console.log(doc.data())
      return users.push({
        id: doc.id,
        data: doc.data(),
      })
    })
    // console.log(users);
    return users
  } catch (error) {
    console.log(error)
  }
}

export async function getAgentMessages(collectionName, params) {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, where('agentUid', '==', params))

    const querySnap = await getDocs(q)

    const users = []
    querySnap.forEach((doc) => {
      // console.log(doc.data());
      return users.push({
        id: doc.id,
        data: doc.data(),
      })
    })
    // console.log(users);
    return users
  } catch (error) {
    console.log(error)
  }
}

export async function getAllCustomersForProfilePageCompanyStats(collectionName, params) {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(
      collectionRef
      // orderBy()
    )

    const querySnap = await getDocs(q)

    const users = []
    querySnap.forEach((doc) => {
      // console.log(doc.data());
      return users.push({
        id: doc.id,
        data: doc.data(),
      })
    })
    // console.log(users);
    return users
  } catch (error) {
    console.log(error)
  }
}

export async function fetchAgentDataForProfileHeader(collectionName, params) {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, where('agentUid', '==', params))

    const querySnap = await getDocs(q)

    const users = []
    querySnap.forEach((doc) => {
      // console.log(doc.data());
      return users.push({
        id: doc.id,
        data: doc.data(),
      })
    })
    // console.log(users);
    return users
  } catch (error) {
    console.log(error)
  }
}
// personStats is a representation of each object
// stats data is the actual array

//  this works as there is a total amount spent on each stat obj
//  so the function loopst through and sorts by data.cmpany and them += mount spent
// if it cant find a company it will create one and the add on the sum to that new company
// the loop keeps in memory the amounts before so it loops once and then adds in the relivent amount
export function calculateCompanyTotals(statsData) {
  // console.log(statsData);
  const companyTotals = {}
  for (const personStats of statsData) {
    const company = personStats.data.company

    if (!companyTotals[company]) {
      // or == null
      companyTotals[company] = 0
    }
    companyTotals[company] += personStats.data.amountSpent
  }
  return companyTotals
}

// THIS FUNCTION NEEDS TO BE MOVED TO A
// FUNCTIONS FOLDER
export function sumByCompany(peopleAndCompanies) {
  // Create a map of company names to total amount spent.
  const companyTotals = new Map()
  for (const person of peopleAndCompanies) {
    console.log(person)
    // console.log(peopleAndCompanies)
    const company = person.data.company
    const amount = person.data.amountSpent
    console.log(company)
    console.log(amount) // calculates the amountSpent in stats

    if (!companyTotals.has(company)) {
      companyTotals.set(company, amount)
    } else {
      companyTotals.set(company, companyTotals.get(company) + amount)
    }
  }

  // Convert the map to an array of objects with the same format as the input data.
  const companyTotalsArray = []
  for (const [company, total] of companyTotals.entries()) {
    companyTotalsArray.push({
      company,
      amount: total,
    })
  }

  return companyTotalsArray
}
