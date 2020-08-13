
function chunkArray(array = [], size) {
  if (array === []) return [];
  return array.reduce((acc, val) => {
    if (acc.length === 0) acc.push([]);
    const last = acc[acc.length - 1];

    // START HACK
    const lastLength = last.length;

    // NOTE: I've added a special case here where
    // and item can specify that it is multiple columns
    // wide.

    // This is the definition of a bad API where a
    // random key on an item can have consequences
    // but it's the least amount of change required
    // to make a non-standard width item in a row work.
    let widthRequired = 1;
    if (val && val.columnsWide) {
      widthRequired = val.columnsWide;
    }
    // END HACK
    if (lastLength < size && widthRequired <= 1) {
      last.push(val);
    } else {
      acc.push([val]);
    }
    return acc;
  }, []);
}

function calculateDimensions({
  itemDimension,
  staticDimension,
  totalDimension,
  fixed,
  spacing,
}) {
  const usableTotalDimension = staticDimension || totalDimension;
  const availableDimension = usableTotalDimension - spacing; // One spacing extra
  const itemTotalDimension = Math.min(itemDimension + spacing, availableDimension); // itemTotalDimension should not exceed availableDimension
  const itemsPerRow = Math.floor(availableDimension / itemTotalDimension);
  const containerDimension = availableDimension / itemsPerRow;

  let fixedSpacing;
  if (fixed) {
    fixedSpacing = (totalDimension - (itemDimension * itemsPerRow)) / (itemsPerRow + 1);
  }

  return {
    itemTotalDimension,
    availableDimension,
    itemsPerRow,
    containerDimension,
    fixedSpacing,
  };
}

function generateStyles({
  itemDimension,
  containerDimension,
  spacing,
  fixed,
  horizontal,
  fixedSpacing,
}) {
  let rowStyle = {
    flexDirection: 'row',
    paddingLeft: fixed ? fixedSpacing : spacing,
    paddingBottom: spacing,
  };

  let containerStyle = {
    flexDirection: 'column',
    justifyContent: 'center',
    width: fixed ? itemDimension : (containerDimension - spacing),
    marginRight: fixed ? fixedSpacing : spacing,
  };

  if (horizontal) {
    rowStyle = {
      flexDirection: 'column',
      paddingTop: fixed ? fixedSpacing : spacing,
      paddingRight: spacing,
    };

    containerStyle = {
      flexDirection: 'row',
      justifyContent: 'center',
      height: fixed ? itemDimension : (containerDimension - spacing),
      marginBottom: fixed ? fixedSpacing : spacing,
    };
  }

  return {
    containerStyle,
    rowStyle,
  };
}

export { chunkArray, calculateDimensions, generateStyles };
