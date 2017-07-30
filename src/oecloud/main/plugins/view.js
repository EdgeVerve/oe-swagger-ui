import React from "react"

export default function(toolbox) {
  let { getSystem } = toolbox
  return {
    rootInjects: {
      getToolBoxedComponent: function(componentName, container) {
        let getComponent = getSystem().getComponent
        let Component = getComponent(componentName, container)
        return class extends React.Component {
          render() {
            console.log(`RENDER: ${componentName} (ToolBoxed)`)
            return (<Component toolbox={ getSystem() } {...this.props } />)
          }
        }
      }
    }
  }
}
