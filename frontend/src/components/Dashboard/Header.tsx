import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import {
  setMacId,
  setSelectedDate,
  setTodayAsSelectedDate,
} from "../../redux/actions";
import LeftNav from "./LeftNav";

import RightNav from "./RightNav";
import PdfGenerator from "../Reports/PdfGenerator";

interface RootState {
  macId: string;
  selectedDate: Date | null;
}

function Header() {
  //const [macID, setMacId] = useState("");
  //const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const currentDate = new Date();

  const dispatch = useDispatch();
  const macId = useSelector((state: RootState) => state.macId);
  const selectedDate = useSelector((state: RootState) => state.selectedDate);

  const handleDropdown = (selectedMachineId: string) => {
    dispatch(setMacId(selectedMachineId));
  };

  const handleDateChange = (date: Date | null) => {
    // setSelectedDate(date);
    dispatch(setSelectedDate(date));
    console.log(selectedDate);
  };

  useEffect(() => {
    // Dispatch the action to set today's date as selected date when the component first renders
    dispatch(setTodayAsSelectedDate());
  }, [dispatch]);

  return (
    <>
      <div>
        <Navbar expand="lg" className="bg-body-tertiary">
          <Container>
            {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <NavDropdown title="Select Machine" id="SelectMachine-dropdown">
                  <NavDropdown.Item
                    id="608A10B60822"
                    onClick={(e) =>
                      handleDropdown((e.target as HTMLElement).id)
                    }
                  >
                    Machine 1
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    id="608A10B603EC"
                    value=""
                    onClick={(e) =>
                      handleDropdown((e.target as HTMLElement).id)
                    }
                  >
                    Machine 2
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    id="Machine3"
                    onClick={(e) =>
                      handleDropdown((e.target as HTMLElement).id)
                    }
                  >
                    Machine 3
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    id="Machine4"
                    onClick={(e) =>
                      handleDropdown((e.target as HTMLElement).id)
                    }
                  >
                    Machine 4
                  </NavDropdown.Item>
                </NavDropdown>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  className="form-control"
                  maxDate={currentDate}
                  placeholderText="Select Date"
                  dateFormat="yyyy-MM-dd"
                />
                <PdfGenerator />
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* <LeftNav macId={macId} selectedDate={selectedDate} /> */}
      </div>

      <Container fluid className="d-flex mt-3">
        {/* <div className="flex-grow-1">
          <LeftNav />
        </div> */}
        {/* <RightNav /> */}
      </Container>
      {/* <RightNav /> */}
    </>
  );
}

export default Header;

