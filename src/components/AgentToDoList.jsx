import { useState, useContext, useEffect } from 'react';
import { serverTimestamp } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import CrmContext from '../crm context/CrmContext';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.config';
import { ReactComponent as Check } from '../icons/checkBox.svg';

import {
  addTaskToDatabase,
  getTasksToDisplayInAgentProfile,
  getTaskToToggleCompleted,
  updateTaskToCompleted,
  getAgentToDisplayChangeUpdateTaskLengthData,
  submitUpdatedTaskLength,
} from '../crm context/CrmAction';
import Loader from '../assets/Loader';
import Spinner from './Spinner';

function AgentToDoList() {
  const auth = getAuth();
  const { dispatch, completedTask } = useContext(CrmContext);
  const [loading, setLoading] = useState(true);
  const chars = 300;
  const [tasksLength, setTasksLength] = useState(0);
  const [agentName, setAgentName] = useState('');
  const [wordCount, setWordCount] = useState('');
  const params = useParams();
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    const getTaskListItems = async () => {
      const data = await getTasksToDisplayInAgentProfile('tasks', params.uid);
      const agentData = await getAgentToDisplayChangeUpdateTaskLengthData(
        'users',
        params.uid
      );
      setTasks(data);
      setLoading(false);
      setTasksLength(agentData[0].data.taskLength);
    };
    getTaskListItems();

    auth.onAuthStateChanged((agent) => {
      if (agent) {
        setAgentName(agent.displayName.split(' ')[0]);
      }
    });

    // const test1 = document.getElementById('taskText').value.toString().length;
    // const test = document.getElementById('taskText');
    // const value = test.addEventListener('keyup', (e) => {
    //   console.log(e.target.value);
    // });

    // console.log(test1);
  }, []);
  const [formData, setFormData] = useState({
    taskText: '',
    day: '',
    month: '',
    year: '',
    taskLength: 0,
    fullDate: '',
  });

  const months = [
    'January',
    'Febuary',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const { taskText, day, month, year, taskLength } = formData;

  const onMutate = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value.slice(0, 2),
    }));
  };

  const onMutateTextArea = (e) => {
    // had to split to get char limit and workimg prop
    setFormData((prevState) => ({
      ...prevState,
      taskText: e.target.value,
      taskLength: e.target.value.length,
      //   CHARACTOR COUNT FOR TEXT AREA
    }));
    // setWordCount(taskText.length);
  };

  //   console.log(greeting);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (month > 12) {
      console.log('month cannot be more than 12');
      return;
    }

    const newData = {
      ...formData,
      fullDate: `${day}/${month}/${year}`,
      timeStamp: serverTimestamp(),
      agentId: params.uid,
      completed: false,
    };

    // -1 to get the right month as 0 based
    months.forEach((monthName, index) => {
      if (index === month - 1) {
        return (newData.formatedDate = `${day}-${monthName}-20${year}`);
      }
    });

    try {
      const data = await addTaskToDatabase('tasks', newData);
      const updatedData = await getTasksToDisplayInAgentProfile(
        'tasks',
        params.uid
      );

      const agentProfileData =
        await getAgentToDisplayChangeUpdateTaskLengthData('users', params.uid);

      const updatedTaskLength = {
        ...agentProfileData[0].data,
        taskLength: updatedData.length,
      };

      const updatedLengthData = submitUpdatedTaskLength(
        'users',
        params.uid,
        updatedTaskLength
      );

      setTasksLength(updatedTaskLength.taskLength);

      setTasks(updatedData);
    } catch (error) {
      console.log(error);
    }
  };

  //   let boolean = false;
  //   console.log(!boolean);
  const toggleCompleted = async (id) => {
    const data = await getTaskToToggleCompleted(id, 'tasks');
    await updateTaskToCompleted(id, data.completed === false ? true : false);
    const dataUpdate = await getTaskToToggleCompleted(id, 'tasks');
    const newData = await getTasksToDisplayInAgentProfile('tasks', params.uid);
    console.log(newData);

    const filteredData = newData.filter(
      (item) => item.data.completed === false
    );
    console.log(filteredData.length);

    // const getAgentProfileToUpdate =
    //   await getAgentToDisplayChangeUpdateTaskLengthData('users', params.uid);
    // console.log(getAgentProfileToUpdate);

    // const updatedFormData = {
    //   ...getAgentProfileToUpdate[0].data,
    //   taskLength: filteredData.length,
    // };

    // const sendUpdate = submitUpdatedTaskLength(
    //   'users',
    //   params.uid,
    //   updatedFormData
    // );
    // setTasksLength(filteredData.length);
    // console.log(updatedFormData);

    setTasks(newData);
    console.log(chars - taskLength); // e.target.value.slice
  };

  const handleTaskDelete = async (id) => {
    await deleteDoc(doc(db, 'tasks', id));
    const updatedData = tasks.filter((item) => item.id !== id);
    setTasks(updatedData);

    try {
      const getAgentProfileToUpdate =
        await getAgentToDisplayChangeUpdateTaskLengthData('users', params.uid);

      const updateUserProfileTaskLength = {
        ...getAgentProfileToUpdate[0].data,
        taskLength: updatedData.length,
      };

      const updatAgentProfile = submitUpdatedTaskLength(
        'users',
        params.uid,
        updateUserProfileTaskLength
      );
      setTasksLength(updateUserProfileTaskLength.taskLength);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="agent-task-list-container">
      <p className="task-list-heading">
        <span className="task-head-span">
          Hey {agentName}! Enter a new task
        </span>
      </p>

      <form onSubmit={handleSubmit} className="todo-form">
        <textarea
          onChange={onMutateTextArea}
          className="task-list-input-text"
          placeholder="Enter Task and completed date"
          id="taskText"
          value={taskText}
        ></textarea>
        <div className="date-container">
          <span className="task-chars-length">{taskLength} chars</span>
          <div>{chars - taskLength} remaining</div>

          <div className="completed-by-container">
            <div className="task-date-heading">
              <span className="to-be-completed-span">completed by: </span>
            </div>

            <div className="task-inputs">
              {' '}
              <input
                onChange={onMutate}
                className="task-list-input-date"
                type="text"
                id="day"
                placeholder="dd"
                value={day}
              />
              <input
                onChange={onMutate}
                className="task-list-input-date"
                type="text"
                id="month"
                placeholder="mm"
                value={month}
              />
              <input
                onChange={onMutate}
                className="task-list-input-date"
                type="text"
                id="year"
                placeholder="yy"
                value={year}
              />
            </div>
          </div>
        </div>

        <div className="task-list-button-container">
          <button className="task-list-button">enter task</button>
        </div>
      </form>
      {/* LOOP TRHROUGH AND FIND WHERE COMPLETED === TRUE TO DISPLAY OUTSANDING TASKS */}
      <div className="task-list-container">
        <p className="task-list-heading">
          <span className="agent-task-name-span">
            Agent Task List For {agentName}
            <span className="agent-task-length-span">{tasksLength}</span>
          </span>
        </p>

        <ul className="task-list-ul">
          {!loading &&
            tasks &&
            tasks.map(({ data, id }) => (
              <li
                key={id}
                className={
                  data.completed ? ' task-item-com task-item' : 'task-item'
                }
              >
                {data.completed && <Check fill="green" className="check-box" />}
                <div className="task-date-container">
                  <p>
                    {' '}
                    <span>completed by: </span> {data.formatedDate}
                  </p>
                </div>
                <div className="task-text">
                  <p className={data.completed ? 'strike-text' : ''}>
                    {data.taskText}
                  </p>
                </div>

                <div className="task-list-buttons-container">
                  <button
                    onClick={() => toggleCompleted(id)}
                    className={
                      data.completed ? 'task-button-completed' : 'task-button'
                    }
                  >
                    {data.completed ? 'completed' : 'mark as done'}
                  </button>
                  <button
                    onClick={() => handleTaskDelete(id)}
                    className="task-button"
                  >
                    delete
                  </button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default AgentToDoList;
