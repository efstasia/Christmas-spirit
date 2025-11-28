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
  const [data, setData] = useState(null); // 👉 now storing a single object

  const { VITE_APP_URL } = import.meta.env;

  async function getData(id) {
    try {
      const response = await fetch(`${VITE_APP_URL}/activities/${id}`);
      if (!response.ok) throw new Error(`Response status: ${response.status}`);

      const result = await response.json();
      console.log("API response:", result.data);
      setData(result.data); // 👉 store the object directly
    } catch (error) {
      console.error(error.message);
    }
  }

  const togglePresent = (id) => {
    setOpenPresents((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <>
      <div>{/* <img src={tree} alt="" /> */}</div>

      <div className="presents">
        {mockData.map((item, index) => {
          const boxColor = boxColors[index % boxColors.length];
          const ribbonColor = ribbonColors[index % ribbonColors.length];
          const isOpen = data && data.status === 'open' && data.id === item.id;

          return (
            <div
              key={item.id}
              className={`present ${isOpen ? "present--open" : ""}`}
              onClick={() => {
                getData(item.id);
              }}
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
                  {isOpen && data && data.id === item.id
                    ? data.title
                    : item.challenge}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
