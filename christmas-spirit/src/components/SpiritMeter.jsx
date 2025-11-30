import React, { useState, useEffect, useRef } from "react";
import Snowfall from "react-snowfall";

export const SpiritMeter = ({
  min = 0,
  max = 100,
  step = 1,
  dbValue = 89,
}) => {
  const [value, setValue] = useState(dbValue); 
  const [score, setScore] = useState(0);
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [password, setPassword] = useState("");

  const [shouldAnimate, setShouldAnimate] = useState(false); 

  const targetValueRef = useRef(dbValue); 
  const animationRef = useRef(null);

  const { VITE_APP_URL } = import.meta.env;

  const handleValueChange = (e) => {
    setValue(e.target.value);
  };

  const handleScorePopup = () => {
    setShowScorePopup(!showScorePopup);
  };

  const handleClosePopup = () => {
    setShowScorePopup(false);
  };

  async function getSpirit() {
    try {
      const response = await fetch(`${VITE_APP_URL}/spirit`);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);

      const result = await response.json();

      targetValueRef.current = result.data;
 
      setValue(result.data);
    } catch (error) {
      console.error(error.message);
    }
  }

  const updateSpirit = async (e) => {
    e.preventDefault();

    try {
      await fetch(`${VITE_APP_URL}/spirit`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newScore: score,
          password: password,
        }),
      });

      await getSpirit(); // fetches updated backend value
      setShowScorePopup(false); // closes popup

      setTimeout(() => {
        setShouldAnimate(true);
      }, 2000);
    } catch (err) {
      console.error("PATCH error:", err);
    }
  };

  useEffect(() => {
    if (!shouldAnimate) return;

    cancelAnimationFrame(animationRef.current);

    const animate = () => {
      setValue((prev) => {
        const target = targetValueRef.current;
        const diff = target - prev;

        if (Math.abs(diff) < 0.5) {
          setShouldAnimate(false);
          return target;
        }

        return prev + diff * 0.05; 
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationRef.current);
  }, [shouldAnimate]);

  useEffect(() => {
    getSpirit();
  }, []);

  return (
    <div className="spirit">
      <Snowfall snowflakeCount={value > 50 ? 400 : 10} />

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
          <button onClick={handleScorePopup} className="button">
            Uppdatera spirit
          </button>
        </div>
      </div>

      {showScorePopup && (
        <div className="spirit__popup">
          <form className="spirit__popup-form" onSubmit={updateSpirit}>
            <div className="spirit__popup-closer" onClick={handleClosePopup}>
              X
            </div>

            <label htmlFor="spirit">
              Spirit
              <input
                name="spirit"
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                max="100"
              />
            </label>

            <label htmlFor="password">
              Lösenord
              <input
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button type="submit">Skicka</button>
          </form>
        </div>
      )}
    </div>
  );
};
