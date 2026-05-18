import React, { useState } from 'react'
import { useSelector } from 'react-redux'

function TicketQueue() {

  //Grab all tickets from the global maintenance store

  const { tickets } = useSelector((state) => state.maintenance);

  //Local state for filtering the queue

  const [statusFilter, setStatusFilter] = useState('All');

  const [priorityFilter, setPriorityFilter] = useState('All');

  //Filter logic based on user selection
  const filteredTickets = tickets.filter((ticket) => {

    const matchesStatus = statusFilter === 'All' || ticket.status === statusFilter;

    const matchesPriority = priorityFilter === 'All' || ticket.priority === priorityFilter;

    return matchesStatus && matchesPriority;
  });
  return (
    <>
    <div>
      {/*Header*/}
      <h1>Central Ticket Queue</h1>
      <p>Review, Filter and monitor all property maintenance tasks in real time</p>
    </div>

    {/*Filter Controls Bar*/}
    <div>
      <h3>Filter Controls</h3>

      {/*Status Filter*/}
      <div>
        <label htmlFor="statusFilterSelect">Filter by Status:</label>
        <select id="statusFilterSelect" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/*Priotity Filter*/}
      <div>
        <label htmlFor="priorityFilterSelect">Filter by Priority:</label>
        <select id="priorityFilterSelect" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="All">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

      </div>
    </div>

    {/*Main Queue List*/}
    <div>
      <h2>Active Backlog({filteredTickets.length}tickets found)</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Unit</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {filteredTickets.length === 0 ? (
            <tr>
              <td colSpan="5">No tickets match the selected filters.</td>
            </tr>

          ) : (
            filteredTickets.map((ticket) => 
            <tr key={ticket.id}>
              <td>#{ticket.id.slice(-4)}</td> {/*Shows the last 4 digits of the ticket ID*/}
              <td>{ticket.unit}</td>
              <td>{ticket.description}</td>
              <td>{ticket.priority}</td>
              
              <td>
                <strong>{ticket.status}</strong>
                </td>
              
            </tr>
            )
          )}
        </tbody>
      </table>
    </div>

    </>
  );
}

export default TicketQueue