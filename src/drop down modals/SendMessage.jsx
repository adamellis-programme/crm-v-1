import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useContext, useState, useEffect } from 'react';
import CrmContext from '../crm context/CrmContext';
import { ReactComponent as Arrow } from '../icons/selectArrow.svg';
import { useParams, useSearchParams } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import {
  getUsersForMessageModalInitialLoad,
  getUserForSendMessagePush,
  getAgentForUpdatingMessagesArrayNumber,
} from '../crm context/CrmAction';

function SendMessage() {
  const date = new Date();
  const dateAndTime = date.toLocaleString('en-GB', {
    dateStyle: 'long',
    timeStyle: 'long',
  });
  const [agentId, setAgentId] = useState('');
  const { dispatch } = useContext(CrmContext);
  const params = useParams();
  const auth = getAuth();
  const [options, setOptions] = useState(null); // agents names for select tag
  const [messageFormData, setMessageFormData] = useState({
    from: '',
    msg: '',
  });

  const { from, msg } = messageFormData;

  const handleCloseModal = () => {
    dispatch({ type: 'TOGGLE_SEND_MSG_MODAL', payload: false });
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
      }
    });

    const getAgents = async () => {
      const selector = document.querySelector('#agents');
      console.log(selector);
      const data = await getUsersForMessageModalInitialLoad('users');
      setOptions(data);
    };

    getAgents();
    console.log('ran ...............!!!!!!!!!!!!');
  }, [setOptions]);
  console.log(options); // if opitions .id !== user id

  const onMutate = (e) => {
    setMessageFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSelect = (item) => {
    // console.log(item);
    const itemName = item;
    const selectTagElement = document.querySelectorAll('.testing');
    selectTagElement.forEach((node) => {
      if (node.dataset.name === itemName) {
        setAgentId(node.dataset.id);
        console.log(node.dataset.id);
      }
    });
  };

  // setTimeout(() => {
  //   // console.log(agentId);
  // }, 4000);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(agentId);
    const initialData = await getUserForSendMessagePush('users', agentId);
    console.log(initialData);

    const agentData = initialData[0].data;

    console.log(agentData);

    const newMessageData = {
      ...agentData,
    };

    //  prettier-ignore
    newMessageData.messages.push({ from, msg, dateAndTime, id: crypto.randomUUID()});
    console.log(newMessageData);
    //  prettier-ignore-end

    const washingtonRef = doc(db, 'users', agentId);
    await updateDoc(washingtonRef, {
      messages: newMessageData.messages,
    });

    
    // set number of messages in users document
    const getUpdatedAgentArray = await getAgentForUpdatingMessagesArrayNumber(
      'users',
      agentId
    );
    console.log(getUpdatedAgentArray[0].data);
    const messageLength = getUpdatedAgentArray[0].data.messages.length;
    const updatedData = {
      ...getUpdatedAgentArray,
      msgLength: messageLength,
    };

    console.log(updatedData);

    await updateDoc(washingtonRef, {
      msgLength: updatedData.msgLength,
    });

    
    // make a request to the users and get the updated message length setMessgLength(...)
    // dispatch({ type: 'TOGGLE_SEND_MSG_MODAL', payload: false });

    // if user uid !== contain ...
    dispatch({ type: 'MESSAGE_COUNTER', payload: updatedData.msgLength });
  };

  return (
    <div className="send-msg-modal">
      <div className="order-edit-modal">
        <p className="messenger-heading-text">
          Send a Message to another agent!
        </p>
        <form onSubmit={handleSubmit}>
          {/* <label htmlFor="cars">Choose a car:</label> */}

          <div className="select-possition-container">
            <select
              onChange={(e) => handleSelect(e.target.value)}
              className="select-agent"
              name="cars"
              id="agents"
            >
              <option>Choose Agent</option>
              {options &&
                options.map((item) => (
                  <option
                    className="testing"
                    data-id={item.id}
                    data-name={item.data.name}
                    key={item.id}
                    value={item.data.name}
                    // onChange={() => handleSelect(item)}
                  >
                    {item.data.name}
                  </option>
                ))}
            </select>
            <div className="select-arrow">
              <Arrow className="select-arrow" />
            </div>
          </div>

          <input
            className="email-form-input"
            type="text"
            id="from"
            placeholder="Msg from"
            onChange={onMutate}
            value={from}
          />

          {/* add in a selector */}

          <textarea
            className="email-form-body"
            placeholder="Enter Message"
            id="msg"
            onChange={onMutate}
            value={msg}
          ></textarea>
          <div className="email-btn-container">
            <button className="send-email-btn">Send Message</button>
          </div>
        </form>
        <button onClick={handleCloseModal} className="close-email-modal-btn">
          X
        </button>
      </div>
    </div>
  );
}

export default SendMessage;
