import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export default function Carousel({ items = [], interval = 5000 }) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!items || items.length === 0 || isPaused) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, interval);
    return () => clearInterval(id);
  }, [items, interval, isPaused]);

  if (!items || items.length === 0) {
    return (
      <div style={{
        position: 'relative',
        height: '500px',
        overflow: 'hidden',
        borderRadius: '20px',
        background: 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p className="text-muted">No carousel images available</p>
      </div>
    );
  }

  const currentItem = items[index];

  const goToSlide = (newIndex) => {
    setIndex(newIndex);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % items.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + items.length) % items.length);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 3000);
  };

  return (
    <div
      style={{
        position: 'relative',
        height: '500px',
        overflow: 'hidden',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        background: 'linear-gradient(135deg, #2f8a1f 0%, #198754 100%)'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: i === index ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              zIndex: i === index ? 2 : 1
            }}
          >
            <img
              src={item.imageUrl}
              alt={item.title || `Slide ${i + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            {/* Overlay Gradient */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '60%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)'
              }}
            />
          </div>
        ))}
      </div>

      {/* Text Overlay */}
      {(currentItem.title || currentItem.subtitle) && (
        <div
          style={{
            position: 'absolute',
            bottom: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
            zIndex: 3,
            color: 'white',
            maxWidth: '90%',
            padding: '0 20px'
          }}
        >
          {currentItem.title && (
            <h2
              style={{
                fontSize: '2.5rem',
                fontWeight: '700',
                marginBottom: '0.5rem',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                lineHeight: '1.2'
              }}
            >
              {currentItem.title}
            </h2>
          )}
          {currentItem.subtitle && (
            <p
              style={{
                fontSize: '1.2rem',
                fontWeight: '400',
                textShadow: '0 2px 8px rgba(0,0,0,0.5)',
                margin: 0
              }}
            >
              {currentItem.subtitle}
            </p>
          )}
        </div>
      )}

      {/* Navigation Arrows */}
      {items.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 4,
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <FaChevronLeft style={{ color: '#2f8a1f', fontSize: '1.2rem' }} />
          </button>

          <button
            onClick={nextSlide}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.9)',
              border: 'none',
              borderRadius: '50%',
              width: '50px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 4,
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.9)';
              e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            <FaChevronRight style={{ color: '#2f8a1f', fontSize: '1.2rem' }} />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {items.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            zIndex: 4
          }}
        >
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              style={{
                width: i === index ? '30px' : '10px',
                height: '10px',
                borderRadius: '5px',
                border: 'none',
                background: i === index ? 'white' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                padding: 0
              }}
              onMouseEnter={(e) => {
                if (i !== index) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.8)';
                }
              }}
              onMouseLeave={(e) => {
                if (i !== index) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.5)';
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

