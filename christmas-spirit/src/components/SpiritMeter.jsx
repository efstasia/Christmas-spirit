import React,  { useState, useEffect, useRef }  from "react";
import Snowfall from 'react-snowfall'

export const SpiritMeter = ({min = 0, max = 100, step = 1, dbValue = 89}) => {
  const [value, setValue] = useState(dbValue)
  const [score, setScore] = useState(0)
  const [showScorePopup, setShowScorePopup] = useState(false)
  const [password, setPassword] = useState('')

  const animationRef = useRef(null);
  
  const { VITE_APP_URL, VITE_APP_PASSWORD } = import.meta.env;
  console.log("🚀 ~ SpiritMeter ~ VITE_APP_PASSWORD:", VITE_APP_PASSWORD)

  const handleValueChange = (e) => {
    const val = e.target.value
    setValue(val)
  }

  const handleScorePopup = () => {
    setShowScorePopup(!showScorePopup)
  }

  const handleClosePopup = () => {
    setShowScorePopup(false)
  }

  async function getSpirit() {
    try {
      const response = await fetch(`${VITE_APP_URL}/spirit`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const result = await response.json();
      setValue(result.data)
    } catch (error) {
      console.error(error.message);
    }
  }

  const updateSpirit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${VITE_APP_URL}/spirit`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          newScore: score, 
          password: password
        }),
      });
  
      const result = await response.json();
      console.log("PATCH result:", result);
    } catch (err) {
      console.error('PATCH error:', err);
    }
  }
  
 
 // Animates value smoothly towards dbValue
 useEffect(() => {
  cancelAnimationFrame(animationRef.current); // cancels previous animation.
  const animate = () => {
    setValue((prev) => {
      const diff = value - prev;
      if (Math.abs(diff) < 0.5) return value; // stops if close enough.
      return prev + diff * 0.05; // moves the icon 10% closer each frame.
    });
    animationRef.current = requestAnimationFrame(animate);
  };
  animate();
  return () => cancelAnimationFrame(animationRef.current);
}, [value]);

useEffect(() => {
  getSpirit()
}, [])

  return (
    <div className="spirit">
      <Snowfall  snowflakeCount={value > 50 ? 400 : 10}/>
      <p className="spirit__value">{Math.round(value)}</p>
      <div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          step={step}
          onChange={handleValueChange}
          className={value > 50 ? "high" : "low"} 
        />
      </div>

      <div className="bg">
        <div className="centerer">
          <button onClick={handleScorePopup} href="#" className="button">Uppdatera spirit</button>
        </div>
      </div>

      {showScorePopup && (
        <div className="spirit__popup">
        <form className="spirit__popup-form" onSubmit={updateSpirit}>
          <div className="spirit__popup-closer" onClick={handleClosePopup}>X</div>
          <label htmlFor="spirit">
            Spirit
          <input name="spirit" type="number" value={score} onChange={(e) => setScore(e.target.value)}/>
          </label>
          <label htmlFor="password">
            Lösenord
          <input name="password" type="password" value={password}   onChange={(e) => setPassword(e.target.value)} />
          </label>

          <button type="submit">Skicka</button>
        </form>

        </div>
      )}
    </div>

  )
}