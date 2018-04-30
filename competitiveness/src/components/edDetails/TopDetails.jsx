import React from 'react'
import { connect } from 'react-redux'
import { Grid } from 'semantic-ui-react'

// election should be dropdown with curr elec selected
const TopDetailsContainer = ({election, margin, winningParty, mrTurnout}) => (
    <Grid.Row className='top-details'>
      <Grid.Column width={3}>
        Total population: 
      </Grid.Column>
      <Grid.Column width={3}>
      </Grid.Column>
      <Grid.Column width={3}>
        Most recent results for {election} election: {winningParty} - {margin}% margin
      </Grid.Column>
      <Grid.Column width={3}>
      </Grid.Column>
      <Grid.Column width={3}>
        Most recent election turnout: {mrTurnout}
      </Grid.Column>
    </Grid.Row>
  ) 

const mapStateToProps = (state) => (
  {election: state.selectedElection,
   margin: Math.abs(state.mapData.geoData.get(state.highlightedEdData.ed)),
   winningParty: state.winningParty.get(state.highlightedEdData.ed),
   mrTurnout: `${(state.highlightedEdData.turnout[0].turnout_16 * 100).toFixed(2)}%`
  })

const TopDetails = connect(mapStateToProps)(TopDetailsContainer)

export default TopDetails;
