import { useState, useEffect, useContext } from 'react';
import CrmContext from '../crm context/CrmContext';
import { useParams } from 'react-router-dom';
import { getAgentMessages } from '../crm context/CrmAction';
import { updateDoc, doc, getDoc, collection } from 'firebase/firestore';
import { db } from '../firebase.config';
function DisplayMessages() {
  const params = useParams();
  const [agentMessages, setAgentMessages] = useState(null);
  const { dispatch } = useContext(CrmContext);

  // make request to update message number on delete

  useEffect(() => {
    const getMessagesFunction = async () => {
      const messagesData = await getAgentMessages('users', params.uid);
      setAgentMessages(messagesData[0].data.messages);
    };

    getMessagesFunction();
  }, [agentMessages]);

  // use of indexOf to get index to splice
  const handleDeleteMessage = async (id) => {
    // console.log(id);
    const userData = await getAgentMessages('users', params.uid);
    const messagesArray = userData[0].data.messages;
    const index = messagesArray.findIndex((object) => object.id === id);
    messagesArray.splice(index, 1);
    // console.log(messagesArray);

    await updateDoc(doc(db, 'users', params.uid), {
      messages: messagesArray,
    });
    const updatadUserData = await getAgentMessages('users', params.uid);
    const updatedMessagesArray = updatadUserData[0].data.messages;
    console.log(updatedMessagesArray);
    // dispatch({ type: 'MESSAGE_COUNTER', payload: updatedMessagesArray.length });
    setAgentMessages(updatedMessagesArray);
    // fetch fresh data and update length

    const agentDataToUpdate = await getAgentMessages('users', params.uid);
    console.log(agentDataToUpdate[0].data.messages.length);
    const agentRef = doc(db, 'users', params.uid);

    await updateDoc(agentRef, {
      msgLength: agentDataToUpdate[0].data.messages.length,
    });

    const agentDataUpdated = await getAgentMessages('users', params.uid);

    const updatedMsgLength = console.log(agentDataUpdated[0].data.msgLength);
    dispatch({
      type: 'MESSAGE_COUNTER',
      payload: agentDataUpdated[0].data.msgLength,
    });
  };
  return (
    <div className="display-messages-container">
      <div className="messages-header">
        <p>Your Messages!</p>
      </div>

      {agentMessages && agentMessages.length === 0 && (
        <div className="no-messages-yet">
          <p>No Messages Yet Check Back Later!</p>
        </div>
      )}

      <ul className="message-ul">
        {agentMessages &&
          agentMessages.length > 0 &&
          agentMessages.map((item, index) => (
            <li key={item.id} className="message-li">
              <div className="message-from-info">
                <span>{item.from}</span> <span>{item.dateAndTime}</span>
                <button
                  onClick={() => handleDeleteMessage(item.id)}
                  className="delete-msg"
                >
                  X
                </button>
              </div>
              <p className="message-display-text">{item.msg}</p>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default DisplayMessages;
