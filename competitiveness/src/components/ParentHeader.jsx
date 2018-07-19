import { Dropdown } from 'semantic-ui-react';
import { connect } from 'react-redux'; 
import { withRouter } from 'react-router-dom';
import RegionPicker from './RegionPicker.jsx';
const React = require('react');

const ParentHeaderContainer = withRouter(({districtType, changeDistrict, history}) => (
    <h1><RegionPicker /> Competitiveness - <Dropdown options={
        [{text: 'Congressional District', value: 'CD'},
         {text: 'State Senate District', value: 'SD'},
         {text: 'State Assembly District', value: 'AD'},
         ]}
         defaultValue={districtType}
         onChange={(e, d) => changeDistrict(e, d, history)}
         className='district-select'
       />
    </h1>
))

const mapStateToProps = (state) => ({
  districtType: state.districtType })

const mapDispatchToProps = (dispatch) => ({
  changeDistrict: (e, d, h) => (
      h.push(`/${d.value}`))
  })

export default connect(mapStateToProps, mapDispatchToProps)(ParentHeaderContainer)

