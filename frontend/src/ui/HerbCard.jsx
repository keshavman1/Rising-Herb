import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

export default function HerbCard({ herb, onChat }){
  return (
    <div className="card h-100">
      {herb.imageUrl && <img src={herb.imageUrl} className="card-img-top" alt={herb.name} />}
      <div className="card-body d-flex flex-column">
        <h5>{herb.name}</h5>
        <p className="flex-grow-1">{herb.description}</p>
        <p className="mb-2"><strong>Price:</strong> ₹{herb.minPrice} - ₹{herb.maxPrice} / {herb.unit}</p>
        <div className="d-flex justify-content-between">
          <button className="btn btn-success btn-sm" onClick={onChat}><FaWhatsapp style={{marginRight:6}}/> Chat</button>
          <small className="text-muted">{herb.category}</small>
        </div>
      </div>
    </div>
  );
}
