export default function AlertTable() {
  return (
    <div>
      <table className="table table-striped" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th scope="col">Alerts</th>
            <th scope="col">Priority</th>
            <th scope="col">Department</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Alert 1</td>
            <td>High</td>
            <td>Dept A</td>
            <td>
              <button>Start</button>
              <button>Stop</button>
            </td>
          </tr>
          <tr>
            <td>Alert 2</td>
            <td>Medium</td>
            <td>Dept B</td>
            <td>
              <button>Start</button>
              <button>Stop</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
