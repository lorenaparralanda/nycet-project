import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux'; 
import { withRouter } from 'react-router-dom';
const React = require('react');

const RegionPickerContainer = withRouter(({availableRegions, changeRegion,
                                 selectedRegion, history}) => {

    let transformedOptions = availableRegions.map((r) => ({text: r, value: r}))

    return (<Dropdown 
                options={ transformedOptions }
                defaultValue={ selectedRegion }
                onChange={(e, d) => changeRegion(e, d, history)}
                className='district-select' />)
})

const mapStateToProps = (state) => ({
    availableRegions: state.allRegions,
    selectedRegion: state.selectedRegion})

const mapDispatchToProps = (dispatch) => ({
    changeRegion: (e, d, h) => (
      h.push(`?region=${d.value}`))
  })

export default connect(mapStateToProps, mapDispatchToProps)(RegionPickerContainer)
