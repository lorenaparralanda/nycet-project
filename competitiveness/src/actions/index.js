import { filterAndProcess, formatToMap, determineSelectedEd } from './mapHelpers'
import { getGeoSource, queryDB, makeEdPayload } from './queryHelpers'
import tabMapping from '../data/tabMapping'
import axios from 'axios'
const d3 = require('d3');
const MAPPING = tabMapping

export const loadHLData = (parentDistrictType, parentDistrictId, selectedElection, childDistrict) => dispatch =>  {
    //determine/declare vars
    let selected  = parentDistrictId
    let districtType = (selected === 0) ? parentDistrictType : 'ED'
    let election = (typeof(selectedElection) === 'undefined') ? parentDistrictType : selectedElection

    //dispatch vars
    dispatch({type: 'IS_LOADING'})
    dispatch(changeDistrict(districtType, parentDistrictType, selected))
    dispatch(changeElection(election))

    queryDB(parentDistrictType, election, selected).then(dataPull => {
        d3.queue()
          .defer(d3.json, getGeoSource(districtType)) 
          .await((error, geoFile) => {
            let [filteredGeo,
                 filteredData] = filterAndProcess(geoFile, dataPull.data, districtType, selected);
            
            let dataMap = formatToMap(filteredData, 'most_rec_pl_margin')

              //dispatch processed data
              dispatch(storeMapData({geoJson: filteredGeo, geoData: dataMap},
                                    'LOAD_MAP_DATA'))

              dispatch(storePartyData(formatToMap(filteredData, 'winning_party')))
              dispatch(storeCandidateData(formatToMap(filteredData, 'winning_candidate')))
              //
              //also auto-select top ED for detail view
              if (districtType === 'ED') {
                let selectedEd = (typeof childDistrict === 'undefined') ? determineSelectedEd(dataMap) : childDistrict
                dispatch(loadEDData(selectedEd, election))
              }
             else {dispatch({type: 'FINISHED_LOADING'})} })
     })
  }


// export const loadEDData = (ed, election) => dispatch => {
export const loadEDData = (ed, election) => dispatch => {
  dispatch({type: 'IS_LOADING_ED'})
  dispatch(setED(ed)) 
  let edStr = ['Ad', `${ed.toString().split('').slice(0,2).join('')}`, '-',
               'Ed', `${ed.toString().split('').slice(2,5).join('')}`].join(' ')

  let tables = {turnout: 'ed_agg_voter_file', census: 'census_ed_demographics',
                acs: 'acs_ed_demographics', ed_metrics: 'ed_metrics'} 

  MAPPING.acs.push({cols: ['total', 'registered_pct']})
  MAPPING['ed_metrics'] = [{cols: [`dbdo_${election.toLowerCase()}`, `wc_${election.toLowerCase()}`]}]

  Object.keys(MAPPING).forEach((demo, i) => {
    let colsForCat = [].concat.apply([], MAPPING[demo].map((cat) => cat.cols))
    let mappedCols = colsForCat.map((col) => `${demo}.${col}`)
    
    let queryParams = {columns: mappedCols,
                       addtlQuery: [` district join ${tables[demo]} ${demo}`,
                                    `on district.countyed = ${demo}.countyed`,
                                    `where district.ed = '${edStr}'`].join(' ')}

    axios({method: 'post',
           url: 'http://localhost:8080/table/electiondistricts',
            data: queryParams}).then((res) => {
              let data = (typeof res.data[0] === 'undefined') ?  {} : res.data[0]
              dispatch(makeEdPayload(colsForCat, demo, data))
              if (i >= (Object.keys(MAPPING).length - 1)) {
                dispatch({type: 'FINISHED_LOADING'})
              }
            }) 
  })
}

//PURE ACTIONS

export const storeMapData = (mapObj, actionType) => ( 
  {type: actionType,
   payload: mapObj}
)

export const storePartyData = (partyMap) => (
  {type: 'STORE_PARTY_DATA',
   payload: partyMap}
)

export const storeCandidateData = (candidateMap) => (
  {type: 'STORE_CANDIDATE_DATA',
   payload: candidateMap}
)

export const setMapDimensions = (width, height) => (
  {type: 'SET_MAP_DIMENSIONS',
   payload: [width, height]}
)

export const setSidebarDimensions = (width, height) => (
  {type: 'SET_SIDEBAR_DIMENSIONS',
   payload: [width, height]}
)

export const changeDistrict = (distType, parentDist, selected) => (
  {type: 'CHANGE_DISTRICT_TYPE',
   payload: {main: distType, parent: parentDist, selected: selected}}
)

export const setED = (ed) => (
  {type: 'SELECT_ED',
   payload: ed}
)

export const changeElection = (election) => (
  {type: 'CHANGE_ELECTION',
   payload: election}
)

export const changeDemoType = (type) => (
  {type: 'CHANGE_DEMO_TYPE',
   payload: type}
)

//consider putting in a timer here to deal with that lingering tooltip prob
export const showTooltip = (mouseEvent, districtNumber) => {
  return {type: 'MOUSE_IN_DISTRICT',
   payload: {showTooltip: true,
             tooltipX: mouseEvent.clientX,
             tooltipY: mouseEvent.clientY,
             districtNumber: districtNumber}}
}

export const hideTooltip = () => (
  {type: 'MOUSE_OUT_MAP'}
)

export const activateGlow = (distNumber) => (
  {type: 'ACTIVATE_GLOW_ONLY',
   payload: distNumber}
)
