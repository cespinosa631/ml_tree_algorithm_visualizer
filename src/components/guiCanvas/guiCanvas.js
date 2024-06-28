import "./guiCanvas.css";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { train, predictDataset } from "./ML_Algorithms/algoSelector.js";
import { Dtparameters, dtpara } from "./Hyperparamters/decisionTreePara";
import { RFparameters, RFpara } from "./Hyperparamters/RFPara.js";
import { PopupWindow } from "./pointSetting/settingWindow.js";
import settingImage from "./Icons/settings.png";
import debounce from "lodash/debounce";

const point_color = ["#e96666", "#9ce472", "#859adf", "#cc49b0"]; // Define point_color array
const background_color = ["#fa0505", "#3a9904", "#0b3cdb", "#a30581"];
const pointRadius = 8; // Set the radius for point sensitivity

function GuiCanvas(props) {
  const canvasRef = useRef(null);
  const [pointOption, setPointOption] = useState(false);
  const [points, setPoints] = useState([]);
  const [prevPoints, setPrevPoints] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedPointIndex, setDraggedPointIndex] = useState(null); // Track the index of the dragged point
  const [selectAlgo, setSelectAlgo] = useState("Decision Tree");
  const [color, setColor] = useState("#fa0505");
  const [mode, setMode] = useState("Add"); // Add, Move, Erase
  const [isUndo, setUndo] = useState(false);
  const [imageData, setImageData] = useState(null); // State to store imageData
  const [previousImageData, setPreviousImageData] = useState(null);
  const [isMovingPoints, setIsMovingPoints] = useState(false); // State to track if moving points mode is enabled
  const [misclassification, setMisclassification] = useState(0);
  const [entropyLoss, setEntropyLoss] = useState(0.0);
  const [isLoading, setIsLoading] = useState(false);
  const [numClasses, setNumClasses] = useState([0, 0, 0, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 600;
    canvas.height = 500;
    const context = canvas.getContext("2d");
    context.lineWidth = 2;
  }, []);

  function drawCircle(x, y, color) {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.strokeStyle = color;
    context.beginPath();
    context.arc(x, y, 4, 0, 2 * Math.PI);
    context.fillStyle = color;
    context.fill();
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Clear the points state
    setPoints([]);
    // Clear the imageData state
    setImageData(null);
    setMisclassification(0);
    setEntropyLoss(0);
  }

  function undoCanvas() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (previousImageData) {
      context.putImageData(previousImageData, 0, 0);

      prevPoints.forEach((point) => {
        drawCircle(point.x, point.y, point.color);
      });
    }
  }

  function handleMouseDown(event) {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;

    if (mode === "Move") {
      points.forEach((point, index) => {
        if (isPointClicked(offsetX, offsetY, point)) {
          setIsDragging(true);
          setDraggedPointIndex(index);
          return;
        }
      });
    } else if (mode === "Add") {
      const classNumber = background_color.indexOf(color);
      const newPoint = { x: offsetX, y: offsetY, color, classNumber };
      setPoints([...points, newPoint]);
      drawCircle(offsetX, offsetY, color);
    } else if (mode === "Erase") {
      erasePoint(offsetX, offsetY);
    }
  }

  function erasePoint(x, y) {
    const filteredPoints = points.filter(
      (point) => !isPointClicked(x, y, point)
    );
    setPoints(filteredPoints);

    redrawCanvas(filteredPoints);
  }

  function redrawCanvas(listPoint) {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    if (imageData) {
      context.putImageData(imageData, 0, 0);
    }
    listPoint.forEach((point) => {
      drawCircle(point.x, point.y, point.color);
    });
  }

  function handleMouseUp() {
    if (isDragging) {
      redrawCanvas(points);
      //runAlgorithm();
    }
    setIsDragging(false);
    setDraggedPointIndex(null); // Reset the dragged point index
  }

  function handleMouseMove(event) {
    if (isDragging) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;

      const updatedPoints = [...points]; // Copy the points array
      updatedPoints[draggedPointIndex] = {
        ...updatedPoints[draggedPointIndex],
        x: offsetX,
        y: offsetY,
      }; // Update the dragged point
      setPoints(updatedPoints);

      //
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      redrawCanvas(points); // Redraw the canvas with the updated points
    }
  }

  function isPointClicked(x, y, point) {
    const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
    return distance <= pointRadius;
  }

  function plot(dataset, predictions, model) {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    // Create a new ImageData object to hold the pixel data
    const newImageData = context.createImageData(width, height);
    const data = newImageData.data;

    for (let i = 0; i < dataset.length; i++) {
      const coordinates = dataset[i];
      const predictedClass = predictions[i];
      const colorIndex = predictedClass * 4;

      // Set the predicted color to the canvas pixel
      const colorHex = point_color[predictedClass];
      const pixelColor = parseInt(colorHex.substring(1), 16);

      const x = coordinates[0];
      const y = coordinates[1];

      const dataIndex = (y * width + x) * 4;
      data[dataIndex] = parseInt(colorHex.substring(1, 3), 16);
      data[dataIndex + 1] = parseInt(colorHex.substring(3, 5), 16);
      data[dataIndex + 2] = parseInt(colorHex.substring(5, 7), 16);
      data[dataIndex + 3] = 255; // Alpha value
    }

    context.putImageData(newImageData, 0, 0);
    setImageData(newImageData);
    console.log(newImageData);
    categoricalCrossEntropyLoss(model, points);
    updateCanvas();
  }

  function getDataset() {
    let dataset = [];
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    for (let y = 0; y < height; y++) {
      dataset[y] = [];
      for (let x = 0; x < width; x++) {
        dataset[y][x] = [x, y];
      }
    }
    //console.log(dataset);
    return dataset;
  }

  async function runAlgorithm() {
    try {
      //setImageData(null);
      setIsLoading(true); // Set loading state to true
      //make points into a dataset
      // After updating points state
      setPoints((newPoints) => [...newPoints]); // Force state update
      const [trainX, trainY] = getXY();
      let model;
      let dataset;
      if (points.length) {
        //get trained model
        model =
          selectAlgo === "Decision Tree"
            ? train(trainX, trainY, dtpara(), selectAlgo)
            : train(trainX, trainY, RFpara(), selectAlgo);
        console.log(model);

        //get canvas grid
        dataset = getDataset();
        // Flatten the dataset for model prediction
        const flattenedDataset = dataset.flat();

        // Predict colors for all pixels in the flattened dataset
        const predictions = predictDataset(flattenedDataset, model);

        //plot points and colors
        plot(flattenedDataset, predictions, model);
      }
    } catch (error) {
      console.error("Error in runAlgorithm:", error);
      // Handle the error appropriately, e.g., display an error message to the user
    } finally {
      setIsLoading(false); // Ensure loading state is set back to false even if there's an error
    }
  }

  function updateCanvas() {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (imageData) {
      context.putImageData(imageData, 0, 0);
      points.forEach((point) => {
        drawCircle(point.x, point.y, point.color);
      });
    }
  }

  function getXY() {
    let X = [];
    let Y = [];
    points.forEach((point) => {
      X.push([point.x, point.y]);
      Y.push(point.classNumber);
    });
    return [X, Y];
  }

  const togglePopup = () => {
    setPointOption(!pointOption);
  };

  const toggleErase = () => {
    // setUndo(!isUndo);
    // if (isUndo) {
    //   undoCanvas();
    // } else {
    //   clearCanvas();
    // }
    clearCanvas();
  };

  const handleRunButtonClick = async () => {
    if (!isLoading) {
      try {
        setIsLoading(true);
        await runAlgorithm();
        runAlgorithm();
        redrawCanvas(points);
      } catch (error) {
        console.error("Error running algorithm:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  function categoricalCrossEntropyLoss(model, points) {
    let misCount = 0;
    let class1 = 0;
    let class2 = 0;
    let class3 = 0;
    let class4 = 0;

    const [X, yTrue] = getXY(points);
    let yPred = model.predict(X);
    console.log("Contents of yTrue:", yTrue);
    console.log("Contents of yPred:", yPred);

    // Check if yTrue and yPred are arrays and have the same length
    if (
      !Array.isArray(yTrue) ||
      !Array.isArray(yPred) ||
      yTrue.length !== yPred.length
    ) {
      console.error("Invalid input format.");
      return { misclassified: -1, averageLoss: NaN }; // Return error value
    }

    for (let i = 0; i < yTrue.length; i++) {
      const trueClass = parseInt(yTrue[i]);
      const predictedClass = parseInt(yPred[i]);

      // Check for misclassification
      if (trueClass !== predictedClass) {
        misCount++;
      }

      if (trueClass === 0) {
        class1++;
      } else if (trueClass === 1) {
        class2++;
      } else if (trueClass === 2) {
        class3++;
      } else {
        class4++;
      }
    }

    // // Compute average loss and round to 5 significant figures
    // let averageLoss = X.length > 0 ? totalLoss / X.length : 0;
    // averageLoss = parseFloat(averageLoss.toFixed(5));

    // setEntropyLoss(averageLoss);
    setMisclassification(misCount);
    setNumClasses([class1, class2, class3, class4]);
  }

  return (
    <div className="algo">
      <div className="topbuttom"></div>
      <div className="con">
        <div className="para-con">
          <label>Algorithm:</label>
          <select
            value={selectAlgo}
            onChange={(e) => setSelectAlgo(e.target.value)}
          >
            <option value="Decision Tree">Decision Tree</option>
            <option value="Random Forest">Random Forest</option>
          </select>
          <label>Hyperparameters:</label>
          {selectAlgo === "Decision Tree" ? <Dtparameters /> : <RFparameters />}
          <button className="button" onClick={handleRunButtonClick}>
            {isLoading ? "Running..." : "Run"}
          </button>
        </div>
        <div className="rightSide">
          <canvas
            className="canvas-con"
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
          ></canvas>
          <div className="bar-con">
            <div>
              <label>Class:</label>
              <select value={color} onChange={(e) => setColor(e.target.value)}>
                <option style={{ backgroundColor: "#fa0505" }} value="#fa0505">
                  Red
                </option>
                <option style={{ backgroundColor: "#3a9904" }} value="#3a9904">
                  Green
                </option>
                <option style={{ backgroundColor: "#0b3cdb" }} value="#0b3cdb">
                  Blue
                </option>
                <option style={{ backgroundColor: "#a30581" }} value="#a30581">
                  Purple
                </option>
              </select>
            </div>
            {/* <button className="button" onClick={toggleMode}>
              {mode === "Add" && "Add Point"}
              {mode === "Erase" && "Erase Point"}
              {mode === "Move" && "Move Point"}

            </button> */}
            <div>
              <label>Mode: </label>
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="Add">Add</option>
                <option value="Erase">Erase</option>
                <option value="Move">Move</option>
              </select>
            </div>
            <button
              style={{ backgroundColor: "#f70a0a" }}
              className="button"
              onClick={toggleErase}
            >
              {isUndo ? "Undo" : "Clear"}
            </button>
          </div>
        </div>
        <div className="pointError">
          <button className="point-setting" onClick={togglePopup}>
            <img className="settingIcon" src={settingImage} alt="Set" />{" "}
            {/* Replace with your settings icon */}
            {pointOption && <PopupWindow />}
          </button>
          <p className="loss">
            <p>Misclassified points: {misclassification}</p>
            <p style={{ color: "#fa0505" }}>Class 1 : {numClasses[0]}</p>
            <p style={{ color: "#3a9904" }}>Class 2 : {numClasses[1]}</p>
            <p style={{ color: "#0b3cdb" }}>Class 3 : {numClasses[2]}</p>
            <p style={{ color: "#a30581" }}>Class 4 : {numClasses[3]}</p>
          </p>
        </div>
      </div>
    </div>
  );
}

export default GuiCanvas;

// in case i forget how to color the canvas
// for (let y = 0; y < height; y++) {
//   for (let x = 0; x < width; x++) {
//     const predictedClass = rules.predict([[x, y]])[0];
//     //const predictedClass = predict([x,y], rules)
//     const colorIndex = predictedClass * 4;

//     data[(y * width + x) * 4] = parseInt(
//       point_color[predictedClass].substring(1, 3),
//       16
//     );
//     data[(y * width + x) * 4 + 1] = parseInt(
//       point_color[predictedClass].substring(3, 5),
//       16
//     );
//     data[(y * width + x) * 4 + 2] = parseInt(
//       point_color[predictedClass].substring(5, 7),
//       16
//     );
//     data[(y * width + x) * 4 + 3] = 255;
//   }
// }
// //data = plot(height, width, rules, data);
// context.putImageData(newImageData, 0, 0);
// setImageData(newImageData);
// setPreviousImageData(newImageData);
// setPrevPoints(points);
// categoricalCrossEntropyLoss(rules, points);
// Redraw all points
