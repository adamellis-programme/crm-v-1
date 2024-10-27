export const CrmReducer = (state, action) => {
  // state is the whole init obj
  // update user is dispatch the whole object and update the noteText
  // then make a new request to fetch the updated item
  switch (action.type) {
    case 'DELETE_USER_TOGGLE':
      return {
        ...state,
        deleteBtn: action.payload,
      }

    case 'SET_TOTAL_AMOUNT_SPENT':
      return {
        ...state,
        totalAmountSpent: action.payload,
      }

    case 'SET_ORDERS':
      return {
        ...state,
        custOrders: action.payload,
      }

    case 'TOGGLE_EDIT_PURCHASE':
      return {
        ...state,
        editPurchase: action.payload,
      }

    case 'TOGGLE_EDIT_NOTE':
      return {
        ...state,
        editNote: action.payload,
      }

    case 'TOGGLE_EMAIL':
      return {
        ...state,
        toggleEmail: action.payload,
      }

    case 'ORDERS':
      return {
        ...state,
        ordersData: action.payload,
      }

    case 'ORDERS_LENGTH':
      return {
        ...state,
        ordersLength: action.payload,
      }
    case 'NOTES_LENGTH':
      return {
        ...state,
        notesLength: action.payload,
      }

    case 'NOTES_DATA':
      return {
        ...state,
        notesData: action.payload,
      }
    case 'CHANGE_DETAILS':
      return {
        ...state,
        changeDetails: action.payload,
      }

    case 'CHANGE_INFO':
      return {
        ...state,
        nameAndPhoneNumber: {
          name: action.name,
          phome: action.phone,
        },
      }

    case 'TOGGLE_SIGN_IN_SIGN_OUT_BUTTON':
      return {
        ...state,
        navLoginLogoutControl: action.payload,
      }

    case 'TOGGLE_SEND_MSG_MODAL':
      return {
        ...state,
        sendMessageModal: action.payload,
      }

    case 'TOGGLE_READ_MESSAGES':
      return {
        ...state,
        readMessageModal: action.payload,
      }

    case 'MESSAGE_COUNTER':
      return {
        ...state,
        messageCounter: action.payload,
      }

    case 'SHOW_PASSWORD_RESET_MODAL':
      return {
        ...state,
        showPasswordResetModal: action.payload,
      }
    case 'SET_STATS':
      return {
        ...state,
        customerStats: action.payload,
      }

    default:
      return state
  }
}
