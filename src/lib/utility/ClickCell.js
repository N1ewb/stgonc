const ClickCell = (time, day, isEditMode, prevChoosenCells) => {
  if (isEditMode) {
    const cellData = { time, day: day.dayOfWeek, fullDay: day };
    const JsonFormat = JSON.stringify(cellData);

    const choosenCell = prevChoosenCells.includes(JsonFormat)
      ? prevChoosenCells.filter((cell) => cell !== JsonFormat)
      : [...prevChoosenCells, JsonFormat];
    console.log(choosenCell)
    return choosenCell;
  }
  return prevChoosenCells;
};

export default ClickCell;
