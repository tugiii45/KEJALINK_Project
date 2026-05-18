import React from "react";
import { useDispatch, useSelector } from "react-redux";

function LandlordDashboard() {
  const dispatch = useDispatch();

  const { tickets } = useSelector((state) => state.maintenance);

  const totalActive = tickets.filter((t) => t.status !== "Resolved").length;

  const pendingCount = tickets.filter((t) => t.status === "Pending").length;

  const resolvedCount = tickets.filter((t) => t.status === "Resolved").length;

  const handleStatusTransition = (ticketId, currentStatus) => {
    let nextStatus = "Pending";
    if (currentStatus === "Pending") nextStatus = "In Progress";
    else if (currentStatus === "In Progress") nextStatus = "Resolved";
    else return;

    dispatch(updateTicketStatus({ ticketId, newStatus: nextStatus }));
  };

  return (
    <>
      <div>
        <h1>Kejalink LandLord Hub</h1>
        <p>Manage Maintenance Requests and property health</p>
      </div>

      <div>
        <ul>
          <li>Active Issues: {totalActive}</li>
          <li>Pending Review: {pendingCount}</li>
          <li>Resolved This Month: {resolvedCount}</li>
        </ul>
      </div>

      <div>
        <h2>Incoming Maintenance Tickets</h2>

        <table>
          <thead>
            <tr>
              <th>Unit / Property</th>
              <br />
              <th>Issue Description</th>
              <br />
              <th>Priority</th>
              <br />
              <th>Status</th>
              <br />
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tickets.length === 0 ? (
              <tr>
                <td colSpan="5">No maintenance tickets submitted yet</td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.unit}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.priority}</td>
                  <td>{ticket.status}</td>

                  <td>
                    {ticket.status !== "Resolved" ? (
                      <button
                        onClick={() =>
                          handleStatusTransition(ticket.id, ticket.status)
                        }
                      >
                        {ticket.status === "Pending"
                          ? "Accept Request"
                          : "Mark as fixed"}
                      </button>
                    ) : (
                      <span>Completed </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default LandlordDashboard;
