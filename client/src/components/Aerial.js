import React, { useEffect, useState } from "react";
import "./static/css/main.css";
import "./static/css/noscript.css";

// Aerial component code here...
const currentDate = new Date();
const currentDay = currentDate.getDate();
const currentMonth = currentDate.getMonth() + 1;

const Aerial = (props ) => {

  const { title } = props.match.params;
  console.log(title);
  const apartments = JSON.parse(process.env.REACT_APP_MY_APARTMENTS);
  let apartmentName = props.match.params; // replace with the parameter you want to check
  apartmentName = "Test";
  if (apartments.hasOwnProperty(apartmentName)) {
    const apartmentTitle = apartments[apartmentName];
    console.log(apartmentTitle); // this will log the value of the apartment's title
  } else {
    console.log("Apartment not found");
  }
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [day, setDay] = useState(currentDay);
  const [month, setMonth] = useState(currentMonth);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      day: parseInt(day, 10),
      month: parseInt(month, 10),
      year: 2023,
    };

    setLoading(true); // Show spinner

    try {
      const response = await fetch("api/booking_date/duomo1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("Server response:", responseData);
        console.log("Booking date submitted:", bookingData);
        setLoading(false); // Hide spinner
        setRedirectUrl(responseData.redirectTo);
      } else {
        if (response.status === 400) alert("Reservation not found");
        console.error("Failed to submit booking date:", bookingData);
        console.log("Server response:", responseData);
        setLoading(false); // Hide spinner
      }
    } catch (error) {
      console.error("Error submitting booking date:", error);
      setLoading(false); // Hide spinner
    }
  };

  useEffect(() => {
    document.body.classList.remove("is-preload");
    window.ontouchmove = () => false;
    window.onorientationchange = () => (document.body.scrollTop = 0);
  }, []);

  return (
    <div id="wrapper">
      <div id="bg"></div>
      <div id="overlay"></div>
      <div id="main">
        <header id="header">
          <h1>{apartmentName}</h1>
          <p>Please input your Check-In date below</p>
          <nav>
            <div className="form-group">
              <form onSubmit={handleSubmit} className="form-custom">
                <div className="form-group">
                  <label htmlFor="day">Day</label>
                  <select
                    name="day"
                    id="day"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    defaultValue={day}
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day < 10 ? `0${day}` : day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="month">Month</label>
                  <select
                    name="month"
                    id="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    defaultValue={month}
                  >
                    {[
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ].map((month, i) => (
                      <option key={month} value={i < 9 ? `0${i + 1}` : i + 1}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="button-container">
                  <button type="submit" className="btn-custom">
                    {loading ? "Loading..." : "Search"}
                  </button>
                </div>
                <div className="help-container">
                  <span className="cloud-text">
                    Need help? Send us an email!
                  </span>
                </div>
                <a href="mailto:example@example.com?subject=Reservation%20help&body=Hi!%20I%20need%20help%20with%20my%20checkin!" className="icon solid fa-envelope">
                  <span className="label">Email</span>
                </a>
              </form>
            </div>
          </nav>
        </header>

        <footer id="footer">
          <span className="copyright">
            &copy; 2024. Design by Simone Ruggiero and Raffaele Chiacchio
          </span>
        </footer>
      </div>
      {redirectUrl ? (
        <a
        href={redirectUrl}
        style={{ display: "none" }}
        ref={(el) => el && el.click()}
      >
        Click here to go to the booking page
      </a>
      ) : null}
    </div>
  );
};

export default Aerial;
