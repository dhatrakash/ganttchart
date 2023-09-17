const cartRoot = document.getElementById("Machine-Info-Widget");

interface MachineInfoWidgetProps {
  machineData: string;
  closeMachineInfoWidget: () => void;
}

export default function MachineInfoWidget({
  machineData,
  closeMachineInfoWidget,
}: MachineInfoWidgetProps) {
  if (cartRoot) {
    return (
      <div className="modal" style={{ display: "block" }}>
        <div className="modal-dialog" style={{ width: "90%", maxWidth: "90%" }}>
          <div className="modal-content" style={{ height: "90%" }}>
            <div className="modal-header">
              <h5 className="modal-title">Machine Data</h5>
              <button
                type="button"
                className="close"
                aria-label="Close"
                onClick={closeMachineInfoWidget}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            {/* Divided the modal content into two sections */}
            <div className="modal-body">
              <div style={{ width: "50%", float: "left" }}>
                <p>{machineData}</p>
                <h5>Chart : 01</h5>
              </div>
              <div style={{ width: "50%", float: "right" }}>
                <p>{machineData}</p>
                <h5>Chart : 02</h5>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeMachineInfoWidget}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
