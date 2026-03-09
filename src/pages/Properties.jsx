import { PROPERTIES } from '../data/data';
import { MapPin, Wifi, Dumbbell, UtensilsCrossed, Car, Wind, WashingMachine, IndianRupee } from 'lucide-react';

const AMENITY_ICONS = {
  'WiFi': Wifi,
  'Gym': Dumbbell,
  'Food': UtensilsCrossed,
  'Parking': Car,
  'AC': Wind,
  'Laundry': WashingMachine,
};

export default function Properties() {
  return (
    <div>
      <div className="page-header">
        <div>
          <h2 className="page-header-title">Properties</h2>
          <p className="page-header-subtitle">{PROPERTIES.length} PG accommodations listed</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
        {PROPERTIES.map(property => (
          <div className="card" key={property.id} style={{ overflow: 'hidden' }}>
            <div style={{
              height: '8px',
              background: `linear-gradient(90deg, var(--primary), var(--primary-light))`,
            }} />
            <div className="card-body">
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>{property.name}</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '12px' }}>
                <MapPin size={14} /> {property.area}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IndianRupee size={16} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--primary)' }}>
                    {property.rent.toLocaleString('en-IN')}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/mo</span>
                </div>
                <span className="badge badge-contacted">{property.type}</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {property.amenities.map(amenity => {
                  const Icon = AMENITY_ICONS[amenity];
                  return (
                    <span key={amenity} style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      background: 'var(--bg-main)',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      fontWeight: 500,
                    }}>
                      {Icon && <Icon size={12} />}
                      {amenity}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
