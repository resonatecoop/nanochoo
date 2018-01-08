/// <reference types="node" />

import * as EventEmitter from 'events'

export = Choo

declare class Choo {
  constructor ()
  use (callback: (state: Choo.IState, emitter: EventEmitter) => void): void
  view (handler: (state: Choo.IState, emit: (name: string, ...args: any[]) => void) => void): void
  mount (selector: string): void
  start (): HTMLElement
  toString (state?: Choo.IState): string
}

declare namespace Choo {
  export interface IState {
    events: {
      [key: string]: string
    }
    params: {
      [key: string]: string
    }
    query?: {
      [key: string]: string
    }
    title: string
    [key: string]: any
  }
}

