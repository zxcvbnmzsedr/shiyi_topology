import React, {useEffect} from 'react'
import Vditor from 'vditor'
import "vditor/src/assets/scss/index.scss"

const e = React.createElement

const Editor = ({content}) => {

  useEffect(() => {
    const vditor = new Vditor('vditor', {
      mode:'ir',
      toolbarConfig: {
        pin: true,
      },
      cache: {
        enable: false,
      },
      after() {
        vditor.setValue(content)
      },
    })
  })
  return e(
    'div',
    {id: 'vditor'},
  )
}
export default Editor
