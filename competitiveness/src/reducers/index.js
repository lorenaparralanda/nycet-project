import { combineReducers } from 'redux';
import { mapDataReducer,
         mapDimensionsReducer,
         sidebarDimensionsReducer,
         districtTypeReducer,
         parentDistrictTypeReducer,
         selectedDistrictReducer,
         selectedElectionReducer,
         winningPartyReducer,
         winningCandidateReducer,
         highlightedEdDataReducer,
         tooltipReducer,
         isLoadingReducer
 } from './reducers';


const NYCETAppReducers = combineReducers({
  mapData: mapDataReducer,
  mapDimensions: mapDimensionsReducer,
  sidebarDimensions: sidebarDimensionsReducer,
  districtType: districtTypeReducer,
  parentDistrictType: parentDistrictTypeReducer,
  selectedDistrict: selectedDistrictReducer,
  selectedElection: selectedElectionReducer,
  winningParty: winningPartyReducer,
  winningCandidate: winningCandidateReducer,
  highlightedEdData: highlightedEdDataReducer,
  tooltip: tooltipReducer,
  isLoading: isLoadingReducer,
  allRegions: allRegionsReducer,
  selectedRegion: selectedRegionReducer
});

export default NYCETAppReducers;
