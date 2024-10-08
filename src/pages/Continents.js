import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import africaImage from '../assets/africa.png';
import asiaImage from '../assets/asia.png';
import europeImage from '../assets/europe.png';
import northAmericaImage from '../assets/north_america.png';
import southAmericaImage from '../assets/south_america.png';
import australiaImage from '../assets/oceania.png';

const continents = [
  { name: 'Africa', path: '/continents/africa', image: africaImage },
  { name: 'Asia', path: '/continents/asia', image: asiaImage },
  { name: 'Europe', path: '/continents/europe', image: europeImage },
  { name: 'North America', path: '/continents/north america', image: northAmericaImage },
  { name: 'South America', path: '/continents/south america', image: southAmericaImage },
  { name: 'Australia', path: '/continents/australia', image: australiaImage },
];

const Continents = () => {
  return (
    <div className='continentsCards'>
      {continents.map((continent) => (
        <Card key={continent.name} className="mb-4">
          <Card.Img variant="top" src={continent.image} alt={continent.name} />
          <Card.Body>
            <Card.Title className="card-title">{continent.name}</Card.Title>
            <Card.Text>
              Discover Wi-Fi locations.
            </Card.Text>
            <div className="btn-back">
              <Link to={continent.path} className="btn">
                Explore {continent.name}
              </Link>
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default Continents;
