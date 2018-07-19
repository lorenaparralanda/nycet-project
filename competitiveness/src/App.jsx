import React, {Component} from 'react';
import { connect } from 'react-redux';
import Competitiveness from './components/Competitiveness'
import { loadHLData, loadEDData, determineRegionsFromS3 } from './actions/index'
import { withRouter } from 'react-router-dom';
const queryString = require('query-string')

class AppContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  //do some checks so we're not calling backend 5 times a load
  static getDerivedStateFromProps(nextProps, prevState) {

    //abstract this check at some point
    let parentDistrictType = (typeof(nextProps.match.params.parentDistrictType) === 'undefined') ? 'CD' : nextProps.match.params.parentDistrictType 
    let selectedDistrict = (typeof(nextProps.match.params.selectedDistrict) === 'undefined') ? 0 : nextProps.match.params.selectedDistrict

    let params = queryString.parse(nextProps.location.search)
    let election = params.election
    let childDistrict = params.ED
    let selectedRegion = (typeof(params.region) === 'undefined') ? 'NYC' : params.region
    console.log(params.region)
    console.log(selectedRegion)
    // eventually, determine region by param here
    // queries should also take in region as an arg

    if (!nextProps.isLoading) {
      //load all regions, if not there
      if (typeof(prevState.allRegions) === 'undefined') {
        nextProps.determineRegionsFromS3();
      }

      //if no district type, just laod default districts
      if (typeof(prevState.parentDistrictType) === 'undefined') {
        nextProps.loadHLData(parentDistrictType, selectedDistrict, election, childDistrict, selectedRegion)
      }

      //if district type, district selection, or election ("big") changes, 
      //load HL data
      else if ((parentDistrictType !== prevState.parentDistrictType) ||
               (selectedDistrict !== prevState.selectedDistrict) ||
               (election !== prevState.election) ||
               (selectedRegion !== prevState.selectedRegion)) {
        nextProps.loadHLData(parentDistrictType, selectedDistrict, election, childDistrict, selectedRegion)
      }
      else if ((childDistrict !== prevState.childDistrict) && (nextProps.election)) {
        if (typeof(childDistrict) === 'undefined'){ 
          nextProps.loadHLData(parentDistrictType, selectedDistrict, election, childDistrict, selectedRegion)
        }
        else {
          nextProps.loadEDData(childDistrict, nextProps.election, selectedRegion)
        }
      }
  }
      return {parentDistrictType: parentDistrictType,
              selectedDistrict: selectedDistrict,
              childDistrict: childDistrict,
              election: election,
              isLoading: nextProps.isLoading,
              selectedRegion: selectedRegion,
              allRegions: nextProps.allRegions}
  }

  render() {
    return (
      <div className='App'>
        <Competitiveness />
      </div>
      )
  }
}

const mapStateToProps = (state) => (
 {parentDistrictType: state.parentDistrictType,
  selectedDistrict: state.selectedDistrict,
  election: state.selectedElection,
  isLoading: state.isLoading,
  allRegions: state.allRegions,
  selectedRegion: state.selectedRegion}
)

const App = withRouter(connect(mapStateToProps, {loadHLData: loadHLData,
                                                 loadEDData: loadEDData,
                                                 determineRegionsFromS3: determineRegionsFromS3 })(AppContainer))

export default App
