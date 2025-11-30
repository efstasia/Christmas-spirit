import React, { useState, useEffect } from "react";
import tree from '../assets/icons/tree.svg';

const mockData = [
  { id: 1, challenge: "Äta gröt", done: false },
  { id: 2, challenge: "Pynta granen", done: false },
  { id: 3, challenge: "Dricka glögg", done: false },
  { id: 4, challenge: "Se en julfilm", done: false },
  { id: 5, challenge: "Slå in julklappar", done: false }
];

const boxColors = ["#b50202", "#541212", "#254D70", "#EE99C2", "#d00000"];
const ribbonColors = ["#fedd7a", "#ffffff", "#FF90BB", "#1B4D3E", "#FFE6E6"];

export const ChristmasPresents = () => {
  const [openPresents, setOpenPresents] = useState({});
  const [presentData, setPresentData] = useState({});

  const { VITE_APP_URL } = import.meta.env;

  async function getData(id) {
    try {
      const response = await fetch(`${VITE_APP_URL}/activities/${id}`);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);

      const result = await response.json();

      setPresentData((prev) => ({
        ...prev,
        [id]: result.data
      }));
    } catch (error) {
      console.error(error.message);
    }
  }

  async function getStatus() {
    try {
      const response = await fetch(`${VITE_APP_URL}/activities`);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);

      const result = await response.json();
 
      setOpenPresents(
        Object.fromEntries(result.data.map((p) => [p.id, p.status]))
      );
    } catch (error) {
      console.error(error.message);
    }
  }

  // Loads which presents are open/closed on mount.
  useEffect(() => {
    getStatus();
  }, []);

  // When openPresents is loaded, this loads data for all open ones.
  useEffect(() => {
    Object.entries(openPresents).forEach(([id, status]) => {
      if (status === "open") {
        getData(id);
      }
    });
  }, [openPresents]);

  return (
    <>
      <div className="presents">
        {mockData.map((item, index) => {
          const boxColor = boxColors[index % boxColors.length];
          const ribbonColor = ribbonColors[index % ribbonColors.length];
          const isOpen = openPresents[item.id] === "open";

          return (
            <div
              key={item.id}
              className={`present ${isOpen ? "present--open" : ""}`}
              onClick={() => getData(item.id)}
              style={{ backgroundColor: boxColor }}
            >
              <div className="present__box">
                <div
                  className="present__ribbon"
                  style={{ backgroundColor: ribbonColor }}
                ></div>

                <div className="present__lid" style={{ backgroundColor: boxColor }}>
                  <div
                    className="present__bow"
                    style={{ backgroundColor: ribbonColor }}
                  ></div>
                  <div
                    className="present__ribbon"
                    style={{ backgroundColor: ribbonColor }}
                  ></div>
                </div>

                <p className="present__challenge-text">
                  {isOpen
                    ? presentData[item.id]?.title  
                    : ''            
                  }
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
