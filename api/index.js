const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const app = express();

dotenv.config();

const { Pool } = require("pg");
let pool;
try {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} catch (error) {
  console.error("Error initializing the database connection:", error);
  // Handle the error appropriately (e.g., throw an error, exit the application)
}



const myApartments = process.env.REACT_APP_MY_APARTMENTS;
const mapping = JSON.parse(myApartments);

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

let checkinUrl = null;

async function findReservation(token, page, date, apartment) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `JWT ${token}`,
  };

  if (checkinUrl === null) {
    const url = `https://a.chekin.io/api/v3/reservations/?page=${page}`;
    console.log(url);
    try {
      const response = await axios.get(url, { headers });

      if (response.status === 200) {
        for (let res of response.data.results) {
          console.log('page', page, 'response', res);
          if (`${date}T00:00:00Z` === res.check_in_date &&apartment === res.housing.name) {
            checkinUrl = res.signup_form_link;
            console.log(checkinUrl);
            break;
          }
        }
      }

      else{
        console.log('Finish');
        return null;
        
      }
    } catch (error) {
      console.error(`Error while fetching reservations: ${error.message}`);
      return null;
    }
  } else {
    return null;
  }
}

async function chekinLogin() {
  try {
    const url = "https://a.chekin.io/api/v3/token/";
    const payload = {
      email,
      password,
    };
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await axios.post(url, payload, { headers });

    const token = response.data.token;

    return token;
  } catch (error) {
    return "Invalid credentials";
  }
}

app.use(bodyParser.json());

app.post("/api/booking_date/:apartment", async (req, res) => {
  
    client = await pool.connect();
    const apartment = req.params.apartment;
    let apartmentFound = null;

    const { day, month, year } = req.body;
    const date = `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;

    apartmentFound = mapping[apartment];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (new Date(date) < today)
      return res.status(400).json({
        success: false,
        message: "Date can't be older than today",
      });

    if (!apartmentFound) {
      return res.status(400).json({
        success: false,
        message: "Apartment not found",
      });
    }
    
    const dateFormatted = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}T00:00:00Z`;
    
    const query = `
        SELECT checkin_link 
        FROM reservations 
        WHERE apartment = $1 AND checkin_date = $2
    `;

    const values = [apartmentFound, dateFormatted];
    const result = await client.query(query, values);

    if (result.rows.length > 0) {
        return res.status(200).json({
            success: true,
            message: "Reservation found",
            redirectTo: result.rows[0].checkin_link,
        });
    }
    else {
      const token = await chekinLogin();

      if (token !== "Invalid credentials") {
        const promises = [];

        for (let i = 1; i < 10; i++) {
          promises.push(findReservation(token, i, date, apartmentFound));
        }

        await Promise.all(promises);

        const url = checkinUrl;

        checkinUrl = null;

        if (url !== null) {
          return res.status(200).json({
            success: true,
            message: "Reservation found",
            redirectTo: url,
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "Reservation not found",
          });
        }
      
      } 
      else {
        return res.status(400).json({
          success: false,
          message: "Server Error",
        });
      }

    } 
  }
    

    );

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
