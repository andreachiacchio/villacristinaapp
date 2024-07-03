import React, { useEffect, useState } from 'react';
import "./static/css/main.css";
import "./static/css/noscript.css";


const CheckinEngine = ({ apartmentTitle, apartmentName }) => {
  const currentDate = new Date();
  const currentDay = String(currentDate.getDate()).padStart(2, "0");
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
  const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [day, setDay] = useState(currentDay);
  const [month, setMonth] = useState(currentMonth);

  useEffect(() => {
    window.onload = () => document.body.classList.remove("is-preload");
    window.ontouchmove = () => false;
    window.onorientationchange = () => (document.body.scrollTop = 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setRedirectUrl("");

    const bookingData = {
      day: parseInt(day, 10),
      month: parseInt(month, 10),
      year: 2024,
    };

    setLoading(true); // Show spinner

    
      const response = await fetch(`/api/booking_date/${apartmentName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      console.log(bookingData);

      const responseData = await response.json();

      if (response.ok) {
        console.log("Server response:", responseData);
        console.log("Booking date submitted:", bookingData);
        setLoading(false); // Hide spinner
        setRedirectUrl(responseData.redirectTo);
      } else {
        if (response.status === 400) {
          if (responseData.message === "Date can't be older than today") {
            alert("Date can't be before today");
          } else {
            alert("Reservation not found");
          }
        }
        console.error("Failed to submit booking date:", bookingData);
        console.log("Server response:", responseData);
        setLoading(false); // Hide spinner
      }
    
  };

  return (
    <div id="wrapper">
        
      <div id="bg"></div>
      <div id="overlay"></div>

    <div id="main">
        <header id="header">
          <h1>{apartmentTitle}</h1>
          <p>
            Please input your{" "}
            <span style={{ fontWeight: "bold" }}>Check-In</span> date below
          </p>

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
                    defaultvalue={day}
                  >
                    <option value="01">1</option>
                    <option value="02">2</option>
                    <option value="03">3</option>
                    <option value="04">4</option>
                    <option value="05">5</option>
                    <option value="06">6</option>
                    <option value="07">7</option>
                    <option value="08">8</option>
                    <option value="09">9</option>
                    <option value="10">10</option>
                    <option value="11">11</option>
                    <option value="12">12</option>
                    <option value="13">13</option>
                    <option value="14">14</option>
                    <option value="15">15</option>
                    <option value="16">16</option>
                    <option value="17">17</option>
                    <option value="18">18</option>
                    <option value="19">19</option>
                    <option value="20">20</option>
                    <option value="21">21</option>
                    <option value="22">22</option>
                    <option value="23">23</option>
                    <option value="24">24</option>
                    <option value="25">25</option>
                    <option value="26">26</option>
                    <option value="27">27</option>
                    <option value="28">28</option>
                    <option value="29">29</option>
                    <option value="30">30</option>
                    <option value="31">31</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="month">Month</label>
                  <select
                    name="month"
                    id="month"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    defaultvalue={month}
                  >
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>

                <div className="button-container">
                  <button type="submit" className="btn-custom">
                    {loading ? "Please wait..." : "Search"}
                  </button>
                </div>
                <div className="help-container">
                  <span className="cloud-text">
                    Need help? Send us an email!
                  </span>
                </div>
                <a
                  href={`mailto:${process.env.REACT_APP_SUPPORT_EMAIL}?subject=Reservation%20help&body=Hi!%20I%20need%20help%20with%20my%20checkin!`}
                  className="icon solid fa-envelope"
                >
                  <span className="label">Email</span>
                </a>
              </form>
            </div>
          </nav>
        </header>

        <footer id="footer">
          <span className="copyright">
            &copy; 2024. Designed by Simone Ruggiero and Raffaele Chiacchio
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

export default CheckinEngine;
