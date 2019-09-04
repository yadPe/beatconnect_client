export default gridData => {
	const {useOverscanForLoading} = this.props; //default is true

	const {
		visibleRowStartIndex,
		visibleRowStopIndex,
		visibleColumnStopIndex,
		overscanRowStartIndex,
		overscanRowStopIndex,
		overscanColumnStopIndex
	} = gridData;

	const endCol =
		(useOverscanForLoading ? overscanColumnStopIndex : visibleColumnStopIndex) + 1;

	const startRow = (useOverscanForLoading ? overscanRowStartIndex : visibleRowStartIndex);
	const endRow = (useOverscanForLoading ? overscanRowStopIndex : visibleRowStopIndex);

	const visibleStartIndex = startRow * endCol;
	const visibleStopIndex = endRow * endCol;
	
   	this.props.onItemsRendered({  //call onItemsRendered from InfiniteLoader so it can load more if needed
		visibleStartIndex,
		visibleStopIndex,
	});
};