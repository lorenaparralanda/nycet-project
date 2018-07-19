//INCLUDES METHODS THAT HELP WITH CALLING EXTERNAL SOURCES
import axios from 'axios'

//MAP METADATA
export const getGeoSource = (dist, region) => {
  region = region.replace(' ', '%20')
  return `https://s3.amazonaws.com/nycet-docs/regional-locations/${region}/${dist}.json`
}

export const queryDB = (dist, election, selected) => {
  let query = (selected === 0) ? getHlQuery(dist) : getEdQuery(dist, election, selected)
  let table = (selected === 0) ? 'hl_metrics' : 'ed_metrics'
  return axios({method: 'post',
        url: `http://localhost:8080/table/${table}/`,
        data: query })
}

const getHlQuery = (dist) => (
  {columns: ['district', 'most_rec_pl_margin',
             'winning_pol_lean', 'winning_party',
             'winning_candidate'],
  filterOn: 'office',
  filterBy: dist})


const getEdQuery = (parentDist, election, selected) => (
{columns: [`e.pl_margin_${election.toString().toLowerCase()} as most_rec_pl_margin`,
           'd.ad',
           'e.countyed',
           `e.wp_${election.toString().toLowerCase()} as winning_party`,
           `e.wc_${election.toString().toLowerCase()} as winning_candidate`,
           'p.map as winning_pol_lean'],
 addtlQuery: [' as e',
             'JOIN electiondistricts as d ON d.countyed = e.countyed',
             `JOIN maps_pollean p ON e.wp_${election.toString().toLowerCase()} = p.party`,
             `WHERE d.${parentDist.toString().toLowerCase()} = ${selected}`].join(' ')})


export const makeEdPayload = (cols, catName, data) => {
  let payload = {}
  cols.forEach((col) => payload[col] = data[col])
  return {type: `LOAD_${catName.toUpperCase()}`, payload: payload}
}
