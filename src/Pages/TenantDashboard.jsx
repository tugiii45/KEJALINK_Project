import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTicket } from '../Features/MaintenanceSlice'

function TenantDashboard() {

  const dispatch = useDispatch();

  const { tickets } = useSelector((state) => state.maintenance);

  const [ unit, setUnit] = useState('');

  const [ description, setDescription] = useState('');

  const [priority, setPriority] = useState('Medium');

  const handleSubmit = (e) => {
    e.preventDefault();

    if(!unit || !description) {
      alert('Please fill out all fields');
      return;
    }

    const newTicket = {
      id: Date.now().toString(),
      unit,
      description,
      priority,
      status: 'Pending'

    };

    dispatch(addTicket(newTicket));

    //Clear form fields
    setUnit('');
    setDescription('');
    setPriority('Medium');
  };


  return (

    <>
    <div>
      <h1>KejaLink Tenant Portal</h1>
      <p>File new maintenance requests and track your current status</p>
    </div>

    {/*Submit a request form*/}
    <div>
     <h2>Submit a Maintenance request</h2>
     <form onSubmit={handleSubmit}>
     
     <div>
      <label htmlFor="unitInput">Unit / Apartment Number:</label>
      <input id='unitInput' type='text' placeholder='e.g Hse 4B, 2G 4D - Seer Green Milimani' value={unit} onChange={(e) => setUnit(e.target.value)}/>
     </div>

     <div>
      <label htmlFor="descInput">Issue Description</label>
      <textarea id="descInput" placeholder='Describe the issue in detail...' value={description} onChange={(e) => setDescription(e.target.value)}/>


     </div>

     <div>
      <label htmlFor="prioritySelect">Priority Level:</label>

      <select id='prioritySelect' value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

     </div>
     <button type="submit">Submit Request</button>
     </form>
     </div>

     {/*Track Requests Table*/}
     <div>
     <h2>Your Maintenance History</h2>
     <table>
      <thead>
        <tr>
          <th>Unit</th>
          <th>Description</th>
          <th>Priority</th>
          <th>Current Status</th>
        </tr>
      </thead>

      <tbody>
        {tickets.length === 0 ? (
          <tr>
            <td colSpan="4">You haven't submitted any requests yet</td>
          </tr>

        ): (

          tickets.map((ticket) => 
            <tr key={ticket.id}>
              <td>{ticket.unit}/</td>
              <td>{ticket.description}/</td>
              <td>{ticket.priority}/</td>


              <td>
                <strong>{ticket.status}/</strong>
                </td>
            </tr>
          ))
        
          }
      </tbody>
     </table>

     </div>

     <div/>
     
     
  </>
  )
}




export default TenantDashboard;

