import React, { useState, useCallback } from 'react'

export const outerStyle = { maxWidth: 980, margin: 'auto' }

export const outerDiv = <div id="story" style={outerStyle}></div>

export const dummyEvent = {
  preventDefaults: () => {},
  stopPropagation: () => {},
  nativeEvent: { stopImmediatePropagation: () => {} },
}

var FakeEmitter = []
export function outerSetup() {
  window.socket = {
    on: (...args) => console.info('socket.io.on', ...args),
    off: (...args) => console.info('socket.io.off', ...args),
    emit: (...args) => FakeEmitter.push(args),
  }
  window.logger = {
    info: console.info,
    error: console.error,
    trace: () => {},
  }
  window.Synapp = { fontSize: 13 }
}

export function asyncSleep(mSec) {
  return new Promise((ok, ko) => setTimeout(() => ok(), mSec))
}

export function asyncEvent(node, eventName) {
  var p = new Promise((ok, ko) => {
    const listener = e => {
      node.removeEventListener(eventName, listener), ok(e)
    }
    node.addEventListener(eventName, listener)
  })
  node[eventName]()
  return p
}

export function getAsyncSemaphore() {
  var result = {}
  result.p = new Promise((ok, ko) => {
    result.ok = ok
    result.ko = ko
  })
  result.p.catch(err => console.error('getAsyncSemaphore catch'))
  return result
}

export function RenderStory(props) {
  return (
    <div
      style={outerStyle}
      ref={e => {
        e && setTimeout(() => props.testFunc(e))
      }}
    />
  )
}

export function onDoneDecorator(Story, context) {
  const [result, setResult] = useState({ count: 0 })
  const onDone = useCallback(res => {
    setResult({ count: result.count + 1, onDoneResult: res })
  })

  context.args.onDone = onDone
  return (
    <>
      <Story />
      {result.count ? (
        <div style={{ width: '100%', border: 'solid 1px black', marginTop: '1rem', marginBottom: '1rem' }}>
          <div>
            onDone:{' '}
            <span title="onDoneResult" id="onDoneResult" style={{ whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(result, null, 4)}
            </span>
          </div>
        </div>
      ) : null}
    </>
  )
}
export function onDoneResult() {
  return JSON.parse(document.getElementById('onDoneResult').innerHTML)
}

export default {
  RenderStory: RenderStory,
  getAsyncSemaphore: getAsyncSemaphore,
  asyncEvent: asyncEvent,
  asyncSleep: asyncSleep,
  outerSetup: outerSetup,
  dummyEvent: dummyEvent,
  outerStyle: outerStyle,
  outerDiv: outerDiv,
}
