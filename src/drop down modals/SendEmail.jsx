import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useContext, useState, useEffect } from 'react';
import CrmContext from '../crm context/CrmContext';
import { submitEmail, getCustomerInfoForEmail } from '../crm context/CrmAction';
import { useParams, useSearchParams } from 'react-router-dom';

function SendEmail() {
  const params = useParams();

  const [form, setForm] = useState({
    agent: '',
    agentId: '',
    emailAddress: '',
    emailSubject: '',
    emailBody: '',
  });

  const { agent, agentId, emailAddress, emailSubject, emailBody } = form;


  const auth = getAuth();

  const { dispatch, toggelEmail } = useContext(CrmContext);
  const handleCloseModal = () => {
    dispatch({ type: 'TOGGLE_EMAIL', payload: false });
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setForm((prevState) => ({
          ...prevState,
          agent: user.displayName,
          agentId: user.uid,
        }));
      }
    });

    const getCurrentCustomer = async () => {
      try {
        const data = await getCustomerInfoForEmail('customers', params.uid);


        setForm((prevState) => ({
          ...prevState,
          emailAddress: data.email,
          emailSubject: `important information for ${data.name}`,
          custId: data.custId,
          customerName: data.name,
          // id: data.id,
          dateSent: new Date().toLocaleString('en-GB'),
          // opened: false,
        }));
      } catch (error) {
        console.log(error);
      }
    };

    getCurrentCustomer();
  }, []);

  const onMutate = (e) => {
    setForm((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailData = {
      ...form,
    };

    submitEmail('emails', emailData);
    setForm((prevState) => ({
      ...prevState,
      emailBody: '',
    }));

    dispatch({ type: 'TOGGLE_EMAIL', payload: false });
  };



  return (
    <div className="order-edit-modal">
      <form onSubmit={handleSubmit}>
        <input
          className="email-form-input"
          type="text"
          id="emailAddress"
          placeholder="Enter Emial Address"
          onChange={onMutate}
          value={emailAddress}
        />
        <input
          className="email-form-input"
          type="text"
          id="emailSubject"
          placeholder="Enter Subject"
          onChange={onMutate}
          value={emailSubject}
        />
        <input
          className="email-form-input"
          type="text"
          id="emailFrom"
          placeholder="email from"
          onChange={onMutate}
          value={agent}
        />

        <textarea
          className="email-form-body"
          placeholder="Enter Email"
          id="emailBody"
          value={emailBody}
          onChange={onMutate}
        ></textarea>
        <div className="email-btn-container">
          <button className="send-email-btn">Send Email</button>
        </div>
      </form>
      <button onClick={handleCloseModal} className="close-email-modal-btn">
        X
      </button>
    </div>
  );
}

export default SendEmail;
