import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Col, Card, Button } from 'react-bootstrap';
import showAlert from '../components/Sweetalert';
import BreadcrumbComp from '../components/BreadcrumbComp';


const City = () => {
  const { continentName, countryName } = useParams();
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`/wifi_locations/?continent=${continentName}&country=${countryName}`);
        const uniqueCities = [...new Set(response.data.map(location => location.city))];
        setCities(uniqueCities);
      } catch (error) {
        showAlert('error', 'Error fetching cities, please refresh and try again', 'error');
      }
    };

    fetchCities();
  }, [continentName, countryName]);

  return (
    <div>
      {/* Display Breadcrumb */}
      <div>
        <BreadcrumbComp continentName={continentName} countryName={countryName} />
      </div>
      <h1 className='pageTitle'>Select a City in {countryName.charAt(0).toUpperCase() + countryName.slice(1)}</h1>
      <div className='list'>
        {cities.map(city => (
          <Col key={city} sm={12} md={6} lg={4}>
            <Card className="mb-4">
              <Card.Body className='citybtn'>
                <Card.Title>{city}</Card.Title>
                <div className="btn-back">
                  <Link to={`/continents/${continentName}/${countryName.toLowerCase()}/${city.toLowerCase()}`} className="btn">
                    Explore {city}
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </div>
    </div>
  );
};

export default City;
