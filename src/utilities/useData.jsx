import { useContext } from "react";
import DataContext from "./DataContext";

const useData = () => useContext(DataContext);

export default useData;