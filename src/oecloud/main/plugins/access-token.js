import { createSelector } from "reselect"

const UPDATE_ACCESS_TOKEN = "update_access_token"
const state = state => state

export default function() {
	return {
		statePlugins: {
			auth: {
				actions: { updateAccessToken },
				selectors: { getAccessToken },
        reducers: {
          [UPDATE_ACCESS_TOKEN]: function(state, { payload }) {
            return state.set("access_token", payload)
          }
        }
			},

		}
	}
}

function updateAccessToken(token) {
	return {
	type: UPDATE_ACCESS_TOKEN,
	payload: token
  }
}

const getAccessToken = createSelector(state, auth => auth.get("access_token"))