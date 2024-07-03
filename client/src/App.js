import React from "react";
import {
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import CheckinEngine from "./components/CheckinEngine";
import { inject } from "@vercel/analytics";

inject();

const MainApp = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const apartmentName = searchParams.get("apartment");
  const apartments = JSON.parse(process.env.REACT_APP_MY_APARTMENTS);
  
  let apartmentTitle = null;

  try {
    if (apartmentName && apartments.hasOwnProperty(apartmentName)) {
      apartmentTitle = apartments[apartmentName];
    } else {
      console.log("Apartment not found");
    }
  } catch (error) {
    console.error(error);
  }

  if (apartmentTitle !== null) {
    return (
      <CheckinEngine
        apartmentTitle={apartmentTitle}
        apartmentName={apartmentName}
      />
    );
  }
  else {
    return (
      <div>
        Not found 
      </div>
    )
  }

};

const App = () => {
  return (
    <Router>
      <MainApp />
    </Router>
  );
};

export default App;
