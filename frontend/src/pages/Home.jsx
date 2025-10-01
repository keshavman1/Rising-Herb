import React, { useEffect, useState } from 'react';
import api from '../services/api';
import HerbCard from '../ui/HerbCard';
import ChatModal from '../ui/ChatModal';

export default function Home(){
  const [herbs, setHerbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/herbs').then(r => setHerbs(r.data)).catch(console.error).finally(()=>setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <h3>Herbs</h3>
      <div className="row g-3">
        {herbs.map(h => (
          <div className="col-md-4" key={h._id}>
            <HerbCard herb={h} onChat={() => setSelected(h)} />
          </div>
        ))}
      </div>

      <ChatModal herb={selected} onClose={() => setSelected(null)} />
    </>
  );
}
