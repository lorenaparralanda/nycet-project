const d3 = require('d3');

export function mapDataReducer(state={
                          geoJson: {type: '', features: []},
                          geoData: d3.map()}, action) {
  switch (action.type) {
    case 'LOAD_MAP_DATA':
      return action.payload
    case 'IS_LOADING':
      return {geoJson: {type: '', features: []}, geoData: d3.map()}
    default:
      return state
  }
}

//currently hardcoded for a 10-row table, don't @ me
export function mapDimensionsReducer(state=[0,471], action) {
  switch (action.type) {
    case 'SET_MAP_DIMENSIONS':
      if (action.payload[1] > 1300) {action.payload[1] = 1300}
      return action.payload
    default:
      return state
  }
}

export function sidebarDimensionsReducer(state=[200,200], action) {
  switch (action.type) {
    case 'SET_SIDEBAR_DIMENSIONS':
      if (action.payload[1] > 300) {action.payload[1] = 300}
      return action.payload
    default:
      return state
  }
}

export function districtTypeReducer(state='CD', action) {
  switch (action.type) {
    case 'CHANGE_DISTRICT_TYPE':
      return action.payload.main
    default:
      return state
  }
}

export function isLoadingReducer(state=false, action){
  switch (action.type) {
    case 'IS_LOADING':
      return true
    // case 'IS_LOADING_ED':
    //   return true
    case 'FINISHED_LOADING':
      return false
    default:
      return state
  }
}

export function selectedIdReducer(state=0, action){
  switch (action.type) {
    case 'SELECTED_DISTRICT':
      return action.payload
    default:
      return state
  }
}

export function parentDistrictTypeReducer(state='AD', action){
  switch (action.type) {
    case 'CHANGE_DISTRICT_TYPE':
      return action.payload.parent
    default:
      return state
  }
}

export function selectedDistrictReducer(state=0, action){
  switch (action.type) {
    case 'CHANGE_DISTRICT_TYPE':
      return action.payload.selected
    default:
      return state
  }
}

export function selectedElectionReducer(state='AD', action){
  switch (action.type) {
    case 'CHANGE_ELECTION':
      return action.payload
    default:
      return state
  }
}

export function winningPartyReducer(state=d3.map(), action){
  switch (action.type) {
    case 'STORE_PARTY_DATA':
      return action.payload
    default:
      return state
  }
}

export function winningCandidateReducer(state=d3.map(), action){
  switch (action.type) {
    case 'STORE_CANDIDATE_DATA':
      return action.payload
    default:
      return state
  }
}

export function highlightedEdDataReducer(state={
    //dunno if this is needed
    ed: 0,
    acs: [{}],
    census: [{}],
    turnout: [{}],
    edMetrics: [{}],
    demoType: 'acs'}, action){
      switch (action.type) {
        case 'SELECT_ED':
          return {...state, ed: action.payload}
        case 'LOAD_ACS':
          let ACSdataReturn = (action.payload.length === 0) ? {} : action.payload
          return {...state, acs: ACSdataReturn,
                            edMetrics: {...state.edMetrics, registered_pct: ACSdataReturn.registered_pct,
                                 total: ACSdataReturn.total}}
        case 'LOAD_CENSUS':
          let censusDataReturn = (action.payload.length === 0) ? {} : action.payload
          return {...state, census: censusDataReturn}
        case 'LOAD_TURNOUT':
          let turnoutDataReturn = (action.payload.length === 0) ? {} : action.payload
          return {...state, turnout: turnoutDataReturn}
        case 'LOAD_ED_METRICS':
          let edmDataReturn = (action.payload.length === 0) ? {} : action.payload
          return {...state, edMetrics: Object.assign(state.edMetrics, edmDataReturn)}
        case 'CHANGE_DEMO_TYPE':
          return {...state, demoType: action.payload}
        default:
          return state
      }
}

export function tooltipReducer(state={
                    showTooltip: false,
                    tooltipX: 0,
                    tooltipY: 0,
                    districtNumber: 0}, action){
  switch (action.type) {
    case 'MOUSE_IN_DISTRICT':
      return action.payload
    case 'MOUSE_OUT_MAP':
      return { showTooltip: false,
               tooltipX: 0,
               tooltipY: 0,
               districtNumber: 0}
    case 'ACTIVATE_GLOW_ONLY':
      return { ...state,
               districtNumber: action.payload}
    default:
      return state
  }
}
