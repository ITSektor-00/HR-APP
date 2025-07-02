import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface PoljaFormProps {
  datumRodjenja: Date | null;
  setDatumRodjenja: (date: Date | null) => void;
}

const PoljaForm: React.FC<PoljaFormProps> = ({ datumRodjenja, setDatumRodjenja }) => (
  <DatePicker
    selected={datumRodjenja}
    onChange={setDatumRodjenja}
    dateFormat="dd.MM.yyyy"
    showYearDropdown
    showMonthDropdown
    dropdownMode="select"
    minDate={new Date(1900, 0, 1)}
    maxDate={new Date()}
    placeholderText="Izaberi datum rođenja"
  />
);

export default PoljaForm; 