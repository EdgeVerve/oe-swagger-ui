import { createSelector } from "reselect"

const state = state => state

// const getTaggedOpsSorted = function() {
//   return ({specSelectors}) => {
//     console.time("taggedOperations")
//     let res = specSelectors.taggedOperations().sort(function(a, b) {
//       let left = a.toJS().tagDetails.name.toLowerCase()
//       let right = b.toJS().tagDetails.name.toLowerCase()
//       return left.localeCompare(right)
//     })
//     console.timeEnd()
//     return res
//   }
// }

const getTaggedOpsSorted = createSelector(state, state => ({specSelectors}) => {
  // console.time("taggedOps")
  let res = specSelectors.taggedOperations().sort( (a,b) => {
    let left = a.toJS().tagDetails.name.toLowerCase()
    let right = b.toJS().tagDetails.name.toLowerCase()
    return left.localeCompare(right)
  })
  // console.timeEnd("taggedOps")
  return res
})

export default function() {
  return {
    statePlugins: {
      spec: {
        selectors: { getTaggedOpsSorted }
      }
    }
  }
}
