//INCLUDES METHODS THAT HELP WITH CALLING EXTERNAL SOURCES
import axios from 'axios'

//MAP METADATA
export const getGeoSource = (dist, region) => {
  let url;
  if (dist !== 'ED') {
    url = `https://s3.amazonaws.com/nycet-docs/state-level/${dist}.json`
  } else {
    region = region.replace(' ', '%20')
    url = `https://s3.amazonaws.com/nycet-docs/ED/${region}-ED.json`
  }
  return url;
}

export const queryDB = (dist, election, selected, region) => {
  let query = (selected === 0) ? getHlQuery(dist, region) : getEdQuery(dist, election, selected)
  let table = (selected === 0) ? 'hl_metrics' : 'ed_metrics'
  return axios({method: 'post',
        url: `http://localhost:8080/table/${table}/`,
        data: query })
}


const getHlQuery = (dist, region) => {
  let filterText;
  if (region === 'NYC') {
    filterText = `edist.county IN ('Queens', 'New York', 'Kings', 'Bronx', 'Richmond')`
  } else {
    filterText = `edist.county = '${region}'`
  }
  return {columns: ['hl.district as district',
             'edist.county as county',
             'hl.most_rec_pl_margin as most_rec_pl_margin',
             'hl.winning_pol_lean as winning_pol_lean', 
             'hl.winning_party as winning_party',
             'hl.winning_candidate as winning_candidate'],
   addtlQuery: [' as hl',
                'INNER JOIN',
                `(select ${dist}, county from electiondistricts group by ${dist}, county) as edist`,
               `on hl.district::text = edist.${dist}::text`,
               `where ${filterText}`,
               `and hl.office = '${dist}'`].join(' ')
}

}

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
